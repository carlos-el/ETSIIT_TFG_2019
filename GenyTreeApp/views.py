
from queue import *
from django.db.models import Q
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.conf import settings
from django.shortcuts import render, redirect, get_object_or_404
from django.utils import translation
from django.utils.decorators import method_decorator
from django.utils.translation import ugettext as _, LANGUAGE_SESSION_KEY
from django.views import View
from .models import Person, Union, Child
from datetime import date, datetime, timedelta
from django.core import serializers
from django.http import JsonResponse
import json, os, magic, pytz
from django.views.decorators.csrf import csrf_exempt
from guardian.shortcuts import assign_perm, get_users_with_perms
from django.core.files.storage import FileSystemStorage
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger


from .forms import *



class HomeView(View):
    def get(self, request):
        return render(request, "home.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse('home'))


class LogInView(View):
    def get(self, request):
        message = []
        next = request.GET.get('next', '')
        if(next):
            message.append(_("Debes iniciar sesión para acceder al contenido"))

        form = UserLogInForm(initial={'next': next})
        return render(request, "login.html", {'form': form, 'errors': message})

    def post(self, request):
        # Obtaining POST data
        form = UserLogInForm(request.POST)
        username = request.POST.get('username', None)
        password = request.POST.get('password', None)
        user = authenticate(username=username, password=password)
        if user is not None:
            # Login the user
            login(request, user)
            # Activate the user language settings
            # try:
            #     translation.activate(user.profile.language)
            #     request.session[LANGUAGE_SESSION_KEY] = user.profile.language
            # except Profile.DoesNotExist:
            #     pass
            # Always redirect after a successful POST request
            next = request.POST.get('next', '')
            if(next):
                return redirect(next)

            return redirect('/')
        else:
            message = [_("Nombre de usuario o contraseña incorrectos")]
            form = UserLogInForm()  # Send new unbound form
            return render(request, "login.html", {'form': form, 'errors': message})


class SignUpView(View):
    def get(self, request):
        form = UserSingUpForm()
        return render(request, "signup.html", {'form': form})

    def post(self, request):
        form = UserSingUpForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user, backend='django.contrib.auth.backends.ModelBackend')
            # Always redirect after a successful POST request
            return redirect('/')
        else:
            message = []

            for field in form.errors:
                for error in form.errors[field]:
                    message.append(error)

            return render(request, "signup.html", {'form': form, 'errors': message})


class EditorView(LoginRequiredMixin, View):
    login_url = '/login/'
    redirect_field_name = 'next'

    def get(self, request):
        link_id = request.GET.get('link_id', '')
        if link_id == '':
            p = Person.objects.first()
            if p != None:
                link_id = p.id
            else:
                link_id = 0

        return render(request, "editor.html", {'link_id': link_id})


class PersonView(LoginRequiredMixin, View):
    login_url = '/login/'
    redirect_field_name = 'next'

    def get(self, request, id):

        if request.META.get('HTTP_ACCEPT', '') == 'application/json' or request.GET.get('format', '') == 'json':
            try:
                person = Person.objects.get(id=id)
            except Person.DoesNotExist:
                return JsonResponse({'Error': 'Persona no encontrada'}, status=404)

            pairs = json.loads(request.GET.get('pairs', '{}'))
            generations = int(request.GET.get('generations', '5'))
            direction = request.GET.get('dir', 'UD')

            if generations > 7 or generations < 0:
                return JsonResponse({'Error': 'El número de generaciones debe estar entre 0 y 7'}, status=404)

            if direction == 'UD':
                down = person.json_down(generations=generations, pairs=pairs)
                up = person.json_up(generations=generations, pairs=pairs, first=True)
            elif direction == 'U':
                down = None
                up = person.json_up(generations=generations, pairs=pairs, first=True)
            elif direction == 'D':
                down = person.json_down(generations=generations, pairs=pairs)
                up = None

            data = {'down': down, 'up': up}

            return JsonResponse(data)

        else:
            person = get_object_or_404(Person, id=id)

            generations = int(request.GET.get('generations', '5'))
            direction = request.GET.get('direction', 'UD')

            if generations > 7 or generations < 0:
                generations = 5

            down = None
            up = None

            if direction == 'UD' or direction == 'U':
                # Retrieve the generations going up
                queue = Queue()
                up = {}
                queue.put([person])

                for x in range(generations):
                    if queue.empty():
                        break

                    parents = []
                    people = queue.get()
                    for p in people:
                        aux = []
                        if x == 0:
                            relative = _('<b>Padres</b>') + ':'
                        elif x == 1:
                            relative = _('<b>Abuelos</b> por parte de <u>') + p.name + ' ' + p.surname + '</u>:'
                        else:
                            relative = _('<b>Abuelos de') + ' ' + str(x) + _(
                                'ª generación</b> por parte de <u>') + p.name + ' ' + p.surname + '</u>:'

                        for parent in p.parents.all():
                            aux.append(parent.name + ' ' + parent.surname)
                            parents.append(parent)

                            up[relative] = aux

                    if len(parents) > 0:
                        queue.put(parents)

            if direction == 'UD' or direction == 'D':
                # Retrieve generations going down
                queue = Queue()
                down = {}
                queue.put([person])

                for x in range(generations):
                    if queue.empty():
                        break

                    childs = []
                    people = queue.get()
                    for p in people:
                        aux = []
                        if x == 0:
                            relative = '<b>' + _('Parejas</b>') + ':'
                        else:
                            relative = '<b>' + _('Parejas') + ' ' + '</b>' + _('de') + '<u> ' + p.name + ' ' + p.surname + '</u>:'

                        for couple in p.couple.all():
                            aux.append(couple.name + ' ' + couple.surname)

                        if len(aux) > 0:
                            down[relative] = aux

                        aux = []
                        if x == 0:
                            relative = '<b>' + _('Hijos') + '</b>:'
                        elif x == 1:
                            relative = '<b>' + _('Nietos') + ' ' + '</b>' + _('por parte de') + '<u> ' + p.name + ' ' + p.surname + '</u>:'
                        else:
                            relative = '<b>' + _('Nietos de ') + str(x) + _(
                                'ª generacion') + '</b> ' + _('por parte de') + '<u> ' + p.name + ' ' + p.surname + '</u>:'

                        for child in p.child.all():
                            other_parent = child.parents.all().exclude(id=p.id).first()
                            addition = ''
                            if other_parent is not None:
                                addition = ' (' + _('con') + ' <u>' + other_parent.name + ' ' + other_parent.surname + '</u>)'
                            aux.append(child.name + ' ' + child.surname + addition)
                            childs.append(child)

                            down[relative] = aux

                    if len(childs) > 0:
                        queue.put(childs)

            data = {'down': down, 'up': up}
            form ={'direction': direction, 'generations': generations}
            users_with_perms = get_users_with_perms(person, only_with_perms_in=['change_person'])

            return render(request, 'person.html', {'person': person, 'form': form, 'data': data, 'user_with_perms': users_with_perms})


    def put(self, request, id):
        try:
            person = Person.objects.get(id=id)
        except Person.DoesNotExist:
            return JsonResponse({'Error': 'Persona no encontrada'}, status=404)

        if request.user.is_authenticated:
            user = request.user
        else:
            return JsonResponse({'Error': 'Usuario no autorizado para esta accion'}, status=403)

        if not(person.creator == user) and not(user.has_perm('change_person', person)):
           return JsonResponse({'Error': 'Permiso denegado para esta accion'}, status=403)

        try:
            body = json.loads(request.PUT['body'])
            print(body)
        except:
            return JsonResponse({'Error': 'Datos erroneos en el formulario'}, status=400)

        img = request.FILES.get('img', None)
        if img is not None:
            if not photo_is_valid(img):
                return JsonResponse({'Error': 'Foto demasiado grande o de formato no permitido'}, status=400)

        if person.updated.timestamp() != body['timestamp']:
            return JsonResponse({'Error': 'La información de la persona que desea editar ha cambiado, recargue e inténtelo de nuevo'}, status=400)
            ##TODO checkear scodigos de estatus este seguro este mal

        succes = person.json_update(body)
        if not succes:
            return JsonResponse({'Error': 'Datos erroneos en el formulario'}, status=400)

        if img is not None:
            old_file_name = person.img_path
            file_name = upload_person_photo(img, str(person.id))
            person.img_path = file_name
            person.save()
            if old_file_name != 'default.png':
                delete_person_photo(old_file_name)

        tree_person = Person.objects.filter(id=body['tree_id']).first()
        if tree_person is None:
            return JsonResponse({'Error': 'Raíz epecificada para el arbol no disponible, seleccione otra persona en'
                                          ' la pantalla personas'}, status=204)

        ##TODO handle possible exception when accessing the dictionary
        direction = body['tree_dir']
        if direction == 'UD':
            down = tree_person.json_down(generations=body['tree_generations'], pairs=body['tree_pairs'])
            up = tree_person.json_up(generations=body['tree_generations'], pairs=body['tree_pairs'], first=True)
        elif direction == 'U':
            down = None
            up = tree_person.json_up(generations=body['tree_generations'], pairs=body['tree_pairs'], first=True)
        elif direction == 'D':
            down = tree_person.json_down(generations=body['tree_generations'], pairs=body['tree_pairs'])
            up = None

        data = {'down': down, 'up': up}

        return JsonResponse(data, status=200)

    def delete(self, request, id):
        try:
            person = Person.objects.get(id=id)
        except Person.DoesNotExist:
            return JsonResponse({'Error': 'Persona no encontrada'}, status=404)

        if request.user.is_authenticated:
            user = request.user
        else:
            return JsonResponse({'Error': 'Usuario no autorizado para esta accion'}, status=403)

        if not (person.creator == user) and not (user.has_perm('delete_person', person)):
            return JsonResponse({'Error': 'Permiso denegado para esta accion'}, status=403)

        can_be_deleted_regarding_childs = True
        for child in person.child.all():
            if child.parents.count() == 1:
                can_be_deleted_regarding_childs = False

        can_be_deleted_regarding_parents = True
        for parent in person.parents.all():
            if parent.child.count() == 1:
                can_be_deleted_regarding_parents = False

        if not (can_be_deleted_regarding_childs or can_be_deleted_regarding_parents):
            return JsonResponse({'Error': 'Debe eliminar primero a los parientes que dependan únicamente de esta persona'}, status=400)

        if person.img_path != 'default.png':
            delete_person_photo(person.img_path)
        person.delete()

        if request.body.decode('utf-8') == '':
            return JsonResponse({'Error': 'Nueva raíz para el arbol no especificada'}, status=204)

        try:
            body = json.loads(request.body.decode('utf-8'))
        except:
            return JsonResponse({'Error': 'Datos erroneos en el formulario'}, status=400)

        tree_person = Person.objects.filter(id=body['tree_id']).first()
        if tree_person is None:
            return JsonResponse({'Error': 'Raíz del árbol no especificada, seleccione una en la pantalla de personas'}, status=400)

        ##TODO handle possible exception when accessing the dictionary
        direction = body['tree_dir']
        if direction == 'UD':
            down = tree_person.json_down(generations=body['tree_generations'], pairs=body['tree_pairs'])
            up = tree_person.json_up(generations=body['tree_generations'], pairs=body['tree_pairs'], first=True)
        elif direction == 'U':
            down = None
            up = tree_person.json_up(generations=body['tree_generations'], pairs=body['tree_pairs'], first=True)
        elif direction == 'D':
            down = tree_person.json_down(generations=body['tree_generations'], pairs=body['tree_pairs'])
            up = None

        data = {'down': down, 'up': up}

        return JsonResponse(data, status=200)


class PersonListView(LoginRequiredMixin, View):
    login_url = '/login/'
    redirect_field_name = 'next'

    def get(self, request):
        if request.META.get('HTTP_ACCEPT', '') == 'application/json' or request.GET.get('format', '') == 'json':
            keyword = request.GET.get('keyword', '')

            person_list = Person.objects.filter(Q(name__icontains=keyword) | Q(surname__icontains=keyword)).order_by('surname', 'name').values('id','name','surname','img_path','birth','death')[:10]

            return JsonResponse({'person_list': list(person_list)})

        else:
            person_list = Person.objects.all().order_by('surname', 'name')
            page = request.GET.get('page', 1)

            paginator = Paginator(person_list, 10)
            try:
                persons = paginator.page(page)
            except PageNotAnInteger:
                persons = paginator.page(1)
            except EmptyPage:
                persons = paginator.page(paginator.num_pages)

            return render(request, 'person_list.html', {'persons': persons})

    def post(self, request):
        if request.user.is_authenticated:
            user = request.user
        else:
            return JsonResponse({'Error': 'Usuario no autorizado para esta accion'}, status=403)

        try:
            body = json.loads(request.POST['body'])
        except:
            return JsonResponse({'Error': 'Datos erroneos en el formulario'}, status=400)

        img = request.FILES.get('img', None)
        if img is not None:
            if not photo_is_valid(img):
                return JsonResponse({'Error': 'Foto demasiado grande o de formato no permitido'})

        #TODO hacer comprobacions de relatives antes de crear persona
        new_person = Person.json_create(body, user)
        if new_person == None:
            return JsonResponse({'Error': 'Datos erroneos en el formulario'}, status=400)

        if body['relative_id'] != 0:
            try:
                relative_person = Person.objects.get(id=body['relative_id'])
            except Person.DoesNotExist:
                new_person.delete()
                return JsonResponse({'Error': 'Pariente de la persona inexistente'}, status=404)

            if relative_person.creator != user and not (user.has_perm('add_person', relative_person)):
                new_person.delete()
                return JsonResponse({'Error': 'Usuario no autorizado para esta accion'}, status=403)

            if relative_person.updated.timestamp() != body['timestamp']:
                new_person.delete()
                return JsonResponse({'Error': 'La información de la persona a la que desea añadir un pariente ha cambiado, recargue e inténtelo de nuevo'}, status=400)
                ##TODO checkear scodigos de estatus este seguro este mal

            # TODO asignar generacion al dar la relacion
            result = relative_person.create_relation_with(new_person, body['relative_type'], body['relative_couple_id'])
            if result != 'success':
                new_person.delete()
                return JsonResponse({'Error': result}, status=400)

            if relative_person.creator != user:
                assign_perm('change_person', relative_person.creator, new_person)
                assign_perm('delete_person', relative_person.creator, new_person)
                assign_perm('add_person', relative_person.creator, new_person)

        if img is not None:
            file_name = upload_person_photo(img, str(new_person.id))
            new_person.img_path = file_name
            new_person.save()

        if body['relative_id'] != 0:
            tree_person = Person.objects.filter(id=body['tree_id']).first()
        else:
            tree_person = new_person
        if tree_person is None:
            return JsonResponse({'Error': 'Raíz epecificada para el arbol no disponible, seleccione otra persona'}, status=204)

        ##TODO handle possible exception when accessing the dictionary
        direction = body['tree_dir']
        if direction == 'UD':
            down = tree_person.json_down(generations=body['tree_generations'], pairs=body['tree_pairs'])
            up = tree_person.json_up(generations=body['tree_generations'], pairs=body['tree_pairs'], first=True)
        elif direction == 'U':
            down = None
            up = tree_person.json_up(generations=body['tree_generations'], pairs=body['tree_pairs'], first=True)
        elif direction == 'D':
            down = tree_person.json_down(generations=body['tree_generations'], pairs=body['tree_pairs'])
            up = None

        data = {'down': down, 'up': up}

        return JsonResponse(data, status=200)

def upload_person_photo(f, prefix=''):
    ext = f.name.split('.')[-1]
    tz = pytz.timezone('Europe/Madrid')
    file_name = prefix + '_' + datetime.now(tz).strftime('%Y-%m-%d_%H:%M:%S_UTC%z') + '.' + ext

    fs = FileSystemStorage()
    file_name = fs.save(file_name, f)

    return file_name


def delete_person_photo(file_name):
    fs = FileSystemStorage()
    fs.delete(file_name)


def photo_is_valid(f):
    valid = True

    if f.size > 12582912:
        valid = False
    elif f.name.split('.')[-1] not in ['png', 'jpg', 'jpeg']:
        valid = False
    elif magic.from_buffer(f.read(), mime=True) not in ['image/png', 'image/jpeg']:
        valid = False

    return valid


class Policies(View):
    def get(self, request):
        return render(request, "policies.html")


class TestView(View):
    def get(self, request):
        # person1 = Person(name='Person1', surname='p1', gender='F', birth=date(2018, 4, 13), death=date(2019, 4, 13),notes='dsdfadf', generation=0)
        # person1.save()
        #
        # coupleP1 = Person(name='CoupleP1', surname='p1', gender='O', birth=date(2018, 4, 13), death=date(2019, 4, 13), generation=0)
        # coupleP1.save()
        # couple2P1 = Person(name='Couple2P1', surname='p1', gender='F', birth=date(2018, 4, 13), death=date(2019, 4, 13), generation=0)
        # couple2P1.save()
        #
        # un = Union(from_person=Person.objects.get(name='Couple2P1'), to_person=Person.objects.get(name='Person1'))
        # un.save()
        # un = Union(from_person=Person.objects.get(name='Person1'), to_person=Person.objects.get(name='Couple2P1'))
        # un.save()
        #
        # un = Union(from_person=Person.objects.get(name='Person1'), to_person=Person.objects.get(name='CoupleP1'))
        # un.save()
        # un = Union(from_person=Person.objects.get(name='CoupleP1'), to_person=Person.objects.get(name='Person1'))
        # un.save()
        #
        # child1P1 = Person(name='Child1P1', surname='p1', gender='U', birth=date(2018, 4, 13), death=date(2019, 4, 13), generation=1)
        # child1P1.save()
        # child2P1 = Person(name='Child2P1', surname='p1', gender='M', birth=date(2018, 4, 13), death=date(2019, 4, 13),notes='child2p1 description', generation=1)
        # child2P1.save()
        # child1C2P1 = Person(name='Child1C2P1', surname='p1', gender='M', birth=date(2018, 4, 13), death=date(2019, 4, 13),notes='child2p1 description', generation=1)
        # child1C2P1.save()
        #
        #
        # coupleC2P1 = Person(name='CoupleC2P1', surname='p1', gender='F', birth=date(2018, 4, 13), death=date(2019, 4, 13), generation=1)
        # coupleC2P1.save()
        #
        # c = Child(parent_person = Person.objects.get(name='Person1'), child_person = Person.objects.get(name='Child1P1'))
        # c.save()
        # c = Child(parent_person = Person.objects.get(name='CoupleP1'), child_person = Person.objects.get(name='Child1P1'))
        # c.save()
        #
        # c = Child(parent_person=Person.objects.get(name='Person1'), child_person=Person.objects.get(name='Child2P1'))
        # c.save()
        # c = Child(parent_person=Person.objects.get(name='CoupleP1'), child_person=Person.objects.get(name='Child2P1'))
        # c.save()
        #
        # un = Union(from_person=Person.objects.get(name='Child2P1'), to_person=Person.objects.get(name='CoupleC2P1'))
        # un.save()
        # un = Union(from_person=Person.objects.get(name='CoupleC2P1'), to_person=Person.objects.get(name='Child2P1'))
        # un.save()

        for e in Person.objects.all():
            print(str(e.id) + " " + e.name)

        for u in Union.objects.all():
            print('Couple: ' + u.from_person.name +' '+ u.to_person.name)

        for c in Child.objects.all():
            print('Child: ' + c.parent_person.name +' '+ c.child_person.name)

        # p = Person.objects.get(id=5)
        # p.creator = User.objects.get(username='carlos')
        # p.save()

        return JsonResponse(Person.objects.get(id=1).json_up())

