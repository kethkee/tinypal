# Generated manually to migrate the onboarding profile from academic fields to scheduling inputs.
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("profiles", "0002_profile_daily_study_target")]

    operations = [
        migrations.AlterField(field=models.CharField(blank=True, max_length=150), name="college", model_name="profile"),
        migrations.AlterField(field=models.CharField(blank=True, max_length=100), name="branch", model_name="profile"),
        migrations.AlterField(field=models.PositiveIntegerField(blank=True, null=True), name="semester", model_name="profile"),
        migrations.RemoveField(model_name="profile", name="goal"),
        migrations.AddField(model_name="profile", name="break_duration", field=models.PositiveIntegerField(default=25)),
        migrations.AddField(model_name="profile", name="tasks", field=models.JSONField(blank=True, default=list)),
        migrations.AddField(model_name="profile", name="priorities", field=models.JSONField(blank=True, default=list)),
        migrations.AddField(model_name="profile", name="commitments", field=models.JSONField(blank=True, default=list)),
    ]
