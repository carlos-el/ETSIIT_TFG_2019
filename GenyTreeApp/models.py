from django.db import models
from django.contrib.auth.models import User
from datetime import date
from guardian.shortcuts import assign_perm, remove_perm
from django.utils.translation import ugettext as _
from django.core.validators import validate_email
from django.core.exceptions import ValidationError

# Create models here.
class Person(models.Model):
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
        ('U', 'Unknown')
    ]

    name = models.CharField(max_length=15, blank=True, default='')
    surname = models.CharField(max_length=30, blank=True, default='')
    email = models.EmailField(max_length=254, blank=True, default='')
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, default='U', blank=True)
    birth = models.DateField(null=True) #Only 2 fields thst can be NULL in the database.
    death = models.DateField(null=True)
    created = models.DateField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    notes = models.CharField(max_length=300, blank=True, default='')
    generation = models.SmallIntegerField(null=True)
    creator = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    img_path = models.CharField(max_length=50, blank=True, default='default.png')
    couple = models.ManyToManyField('self', through='Union', symmetrical=False, related_name='couples')
    child = models.ManyToManyField('self', through='Child', symmetrical=False, related_name='parents')

    @classmethod
    def json_create(cls, properties, creator):
        if properties['birth']['year'] == '' or properties['birth']['year'] == '0':
            birth = None
        else:
            try:
                birth = date(int(properties['birth']['year']), int(properties['birth']['month']),int(properties['birth']['day']))
            except:
                return None

        if properties['death']['year'] == '' or properties['death']['year'] == '0':
            death = None
        else:
            try:
                death = date(int(properties['death']['year']), int(properties['death']['month']), int(properties['death']['day']))
            except:
                return None

        if birth is not None and death is not None:
            if birth < death:
                return None

        if properties['email'] != '':
            try:
                validate_email(properties['email'])
            except ValidationError:
                return None

        try:
            p = cls(gender=properties['gender'],
                    name=properties['name'],
                    surname=properties['surname'],
                    email=properties['email'],
                    notes=properties['notes'],
                    birth=birth,
                    death=death,
                    creator=creator
                    )

            p.save()
        except:
            return None

        return p

    def create_relation_with(self, person, relative_type, relative_couple_id=0):

        relative_couple = None
        if relative_couple_id != 0:
            try:
                relative_couple = Person.objects.get(id=relative_couple_id)
            except:
                return _('Datos erroneos en el formulario')

            if not(relative_couple in self.couple.all()):
                return _('Datos erroneos en el formulario')

        if relative_type == 'U':
            un = Union(from_person=self, to_person=person)
            un.save()
            un = Union(from_person=person, to_person=self)
            un.save()
        elif relative_type == 'S':
            if self.parents.count() > 0:
                for parent in self.parents.all():
                    c = Child(parent_person=parent, child_person=person)
                    c.save()
            else:
                return _('Error, o se pueden añadir hermanos sin progenitores')
        elif relative_type == 'P':
            if self.parents.count() >= 2:
                return _('Error, esta persona ya cuenta con dos progenitores')
            else:
                c = Child(parent_person=person, child_person=self)
                c.save()
                if self.parents.count()-1 == 1:
                    un = Union(from_person=self.parents.all().first(), to_person=person)
                    un.save()
                    un = Union(from_person=person, to_person=self.parents.all().first())
                    un.save()
        elif relative_type == 'C':
            c = Child(parent_person=self, child_person=person)
            c.save()
            if relative_couple:
                c = Child(parent_person=relative_couple, child_person=person)
                c.save()
        else:
            return _('Datos erroneos en el formulario')

        return 'success'

    def json_update(self, properties):
        if properties['birth']['year'] == '' or properties['birth']['year'] == '0':
            birth = None
        else:
            try:
                birth = date(int(properties['birth']['year']), int(properties['birth']['month']),int(properties['birth']['day']))
            except:
                return False

        if properties['death']['year'] == '' or properties['death']['year'] == '0':
            death = None
        else:
            try:
                death = date(int(properties['death']['year']), int(properties['death']['month']), int(properties['death']['day']))
            except:
                return False

        perms = properties['perm'].replace(" ", "")
        type_perm = properties['type_perm']
        if perms and type_perm in ['assign', 'remove']:
            users = []
            try:
                user_perms = perms.split(';')
                for username in user_perms:
                    users.append(User.objects.get(username=username))
            except:
                return False
            for user in users:
                if type_perm == 'assign':
                    assign_perm('change_person', user, self)
                    assign_perm('delete_person', user, self)
                    assign_perm('add_person', user, self)
                else:
                    remove_perm('change_person', user, self)
                    remove_perm('delete_person', user, self)
                    remove_perm('add_person', user, self)

        try:
            self.gender = properties['gender']
            self.name = properties['name']
            self.surname = properties['surname']
            self.email = properties['email']
            self.notes = properties['notes']
            self.birth = birth
            self.death = death
        except:
            return False

        self.save()
        return True


    def json_down(self, only_properties=False, generations=5, pairs={}, all_childs=False):
        """
        Returns a Json-like dictionary object of the Person object. The object returned is intended
        to be passed to the React frontend and it has several properties not included in the model.
        :param only_properties: Specifies if information about couples and childs is needed.
            If true, this information is skipped.
        :param generations: Number of generation to retrieve from the tree. Decreases in each call to childs
        :param pairs: dict of strings in the keys and the values
        :param all_childs: boolean to specify if we have to return all childs of a person or only the ones in common
            with its selected couple
        :return: Json-like dictionary object to be used by React frontend
        """

        name = _('Desconocido')
        if name != '':
            name = self.name

        birth = {'day': '', 'month': '', 'year': ''}
        death = {'day': '', 'month': '', 'year': ''}
        if self.birth != None:
            birth = {'day': self.birth.day, 'month': self.birth.month, 'year': self.birth.year}
        if self.death != None:
            death = {'day': self.death.day, 'month': self.death.month, 'year': self.death.year}

        creator = ''
        if self.creator != None:
            creator = self.creator.username

        # Dictionary with the basic properties needed in the React frontend
        # (only_properties=True is only needed for couples)
        dict = {
            'id': self.id,
            'name': name,
            'surname': self.surname,
            'email': self.email,
            'gender': self.gender,
            'birth': birth,
            'death': death,
            'notes': self.notes,
            'timestamp': self.updated.timestamp(),
            'img_path': self.img_path,
            'num_parents': self.parents.count(),
            'creator': creator
        }


        if not only_properties:
            # Initialize objects to the empty state
            couple_selected = None
            other_couples = Person.objects.none()
            child = []
            # Get couples of the person
            queryset = self.couples.all()
            # If there are any couple:
            if queryset:
                # If the person is in the pairs dictionary then:
                if str(self.id) in pairs.keys():
                    # Select the couple specified in the dictionary
                    couple_selected = queryset.filter(id=int(pairs[str(self.id)])).first()
                    # In case that the id of the couple of the pairs dictionary is wrong or 0 (Zero means not returning a selected couple):
                    if couple_selected is None:
                        # Select the first couple added (default) or dont select any couple.
                        if int(pairs[str(self.id)]) == 0:
                            couple_selected = None
                        else:
                            couple_selected = queryset.order_by('id').first()
                else:
                    # Select the first couple added (default)
                    couple_selected = queryset.order_by('id').first()

                # Include the other couples by excluding the selected couple from the queryset of all couples
                if couple_selected is not None:
                    other_couples = queryset.exclude(id=couple_selected.id)
                else:
                    other_couples = queryset

            # List childs of both couple members only if we have generations to list
            if int(generations) > 0:
                # If there are a couple selected then make the intersection between
                # the childs of the person and the childs of the couple selected
                if couple_selected and not all_childs:
                    child = self.child.all() & couple_selected.child.all()
                # If there are no couple selected then list all the childs
                else:
                    child = self.child.all()

            # We have the objects with the info but we have to format them to json
            if couple_selected:
                couple_selected_json = couple_selected.json_down(only_properties=True)
            else:
                couple_selected_json = None

            other_couples_json = [person.json_down(only_properties=True) for person in other_couples]
            child_json = [person.json_down(generations=int(generations)-1, pairs=pairs, all_childs=all_childs) for person in child]
            parents_ids = [parent.id for parent in self.parents.all()]


            # Introduce the values in the dictionary
            dict['parents_ids'] = parents_ids
            dict['couple_selected'] = couple_selected_json
            dict['other_couples'] = other_couples_json
            dict['childs'] = child_json


        return dict

    def json_up(self, only_properties=False, generations=5, pairs={}, first=False):

        name = _('Desconocido')
        if name != '':
            name = self.name

        birth = {'day': '', 'month': '', 'year': ''}
        death = {'day': '', 'month': '', 'year': ''}
        if self.birth != None:
            birth = {'day': self.birth.day, 'month': self.birth.month, 'year': self.birth.year}
        if self.death != None:
            death = {'day': self.death.day, 'month': self.death.month, 'year': self.death.year}

        creator = ''
        if self.creator != None:
            creator = self.creator.username

        # Dictionary with the basic properties needed in the React frontend
        # (only_properties=True is only needed for couples)
        dict = {
            'id': self.id,
            'name': self.name,
            'surname': self.surname,
            'email': self.email,
            'gender': self.gender,
            'birth': birth,
            'death': death,
            'notes': self.notes,
            'num_parents': self.parents.count(),
            'timestamp': self.updated.timestamp(),
            'img_path': self.img_path,
            'creator': creator,
        }

        if not only_properties:
            # Initialize objects to the empty state
            couple_selected = None
            other_couples = Person.objects.none()
            child = []
            # Get couples of the person
            queryset = self.couples.all()

            # If there are any couple:
            if queryset:
                # If the person is in the pairs dictionary then:
                if str(self.id) in pairs.keys():
                    # Select the couple specified in the dictionary
                    couple_selected = queryset.filter(id=int(pairs[str(self.id)])).first()
                    # In case that the id of the couple of the pairs dictionary is wrong:
                    if couple_selected is None:
                        if int(pairs[str(self.id)]) == 0:
                            couple_selected = None
                        else:
                            couple_selected = queryset.order_by('id').first()
                else:
                    # Select the first couple added (default)
                    couple_selected = queryset.order_by('id').first()

                # Include the other couples by excluding the selected couple from the queryset of all couples
                if couple_selected is not None:
                    other_couples = queryset.exclude(id=couple_selected.id)
                else:
                    other_couples = queryset

            # List childs (in this case the childs are the parents of the self person and its couple)
            if int(generations) > 0:
                # Get self parents
                parents = self.parents.all()
                p1 = parents.first()
                if p1:
                    child.append(p1)

                    p2 = parents.last()
                    if p2:
                       pairs[str(p1.id)] = str(p2.id)

                # If there are a couple selected then get its parents
                if couple_selected:
                    parents = couple_selected.parents.all()
                    p1 = parents.first()
                    if p1:
                        child.append(p1)

                        p2 = parents.last()
                        if p2:
                            pairs[str(p1.id)] = str(p2.id)

            # We have the objects with the info but we have to format them to json
            if couple_selected:
                couple_selected_json = couple_selected.json_up(only_properties=True)
            else:
                couple_selected_json = None

            other_couples_json = [person.json_down(only_properties=True) for person in other_couples]
            child_json = [person.json_up(generations=int(generations)-1, pairs=pairs) for person in child]

            # Introduce the values in the dictionary
            dict['couple_selected'] = couple_selected_json
            dict['other_couples'] = other_couples_json
            dict['childs'] = child_json

        return dict


# Create the reverse relationship manually yourself via the through model (only for the union):
# Union(from_person=Person.objects.get(name='Person1'), to_person=Person.objects.get(name='CoupleP1'))
# Union(from_person=Person.objects.get(name='CoupleP1'), to_person=Person.objects.get(name='Person1'))
# Make sure both sides of the relationship are removed when one is removed
class Union(models.Model):
    from_person = models.ForeignKey(Person, on_delete=models.CASCADE, related_name='from_person')
    to_person = models.ForeignKey(Person, on_delete=models.CASCADE, related_name='to_person')
    start_date = models.DateField(null=True)
    finish_date = models.DateField(null=True)


class Child(models.Model):
    parent_person = models.ForeignKey(Person, on_delete=models.CASCADE, related_name='parent_person')
    child_person = models.ForeignKey(Person, on_delete=models.CASCADE, related_name='child_person')
    biological = models.BooleanField(default=True)
