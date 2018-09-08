# Generated by Django 2.1.1 on 2018-09-01 14:03

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('folly_api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Component',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=64, unique=True)),
                ('description', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='Entity',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=64, unique=True)),
                ('description', models.TextField()),
                ('components', models.ManyToManyField(related_name='implementers', to='folly_api.Component')),
            ],
        ),
        migrations.AddField(
            model_name='project',
            name='slug',
            field=models.SlugField(allow_unicode=True, default='default-slug', max_length=64),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='entity',
            name='project',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='entities', to='folly_api.Project'),
        ),
        migrations.AddField(
            model_name='component',
            name='project',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='components', to='folly_api.Project'),
        ),
    ]