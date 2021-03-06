# Generated by Django 2.2 on 2019-06-07 14:03

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('GenyTreeApp', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Union',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start_date', models.DateField(null=True)),
                ('finish_date', models.DateField(null=True)),
                ('from_person', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='from_person', to='GenyTreeApp.Person')),
                ('to_person', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='to_person', to='GenyTreeApp.Person')),
            ],
        ),
        migrations.CreateModel(
            name='Child',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('biological', models.BooleanField(default=True)),
                ('child_person', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='child_person', to='GenyTreeApp.Person')),
                ('parent_person', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='parent_person', to='GenyTreeApp.Person')),
            ],
        ),
        migrations.AddField(
            model_name='person',
            name='child',
            field=models.ManyToManyField(related_name='parents', through='GenyTreeApp.Child', to='GenyTreeApp.Person'),
        ),
        migrations.AddField(
            model_name='person',
            name='couple',
            field=models.ManyToManyField(related_name='couples', through='GenyTreeApp.Union', to='GenyTreeApp.Person'),
        ),
    ]
