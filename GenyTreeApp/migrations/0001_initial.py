# Generated by Django 2.2 on 2019-06-07 13:52

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Person',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=15)),
                ('surname', models.CharField(blank=True, max_length=30)),
                ('email', models.EmailField(blank=True, max_length=254)),
                ('gender', models.CharField(blank=True, choices=[('M', 'Male'), ('F', 'Female'), ('O', 'Other'), ('U', 'Unknown')], default='U', max_length=1)),
                ('birth', models.DateField(null=True)),
                ('death', models.DateField(null=True)),
                ('created', models.DateField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('notes', models.CharField(blank=True, default='', max_length=300)),
                ('generation', models.SmallIntegerField()),
                ('img_path', models.CharField(blank=True, default='default.png', max_length=50)),
            ],
        ),
    ]
