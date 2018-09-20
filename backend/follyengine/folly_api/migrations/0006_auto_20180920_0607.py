# Generated by Django 2.1.1 on 2018-09-20 06:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('folly_api', '0005_flow_project'),
    ]

    operations = [
        migrations.AlterField(
            model_name='component',
            name='name',
            field=models.CharField(max_length=64),
        ),
        migrations.AlterField(
            model_name='entity',
            name='name',
            field=models.CharField(max_length=64),
        ),
        migrations.AlterField(
            model_name='entity',
            name='slug',
            field=models.SlugField(allow_unicode=True, max_length=64),
        ),
        migrations.AlterField(
            model_name='flow',
            name='name',
            field=models.CharField(max_length=64),
        ),
    ]
