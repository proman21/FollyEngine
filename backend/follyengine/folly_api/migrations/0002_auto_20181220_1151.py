# Generated by Django 2.1.4 on 2018-12-20 11:51

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('folly_api', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='flow',
            old_name='data',
            new_name='graph',
        ),
    ]
