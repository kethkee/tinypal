from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase


class ProfileApiTests(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(email="test@example.com", full_name="Test User", password="StrongPass123")
        self.client.force_authenticate(self.user)
        self.payload = {
            "tasks": [{"title": "Complete DBMS assignment", "category": "Assignment"}],
            "priorities": ["Projects", "Learning"],
            "commitments": [{"day": "Monday", "start": "09:00", "end": "16:00", "title": "College", "category": "Class"}],
            "wake_up_time": "07:00", "sleep_time": "23:00", "preferred_study_time": "evening", "daily_study_target": 3, "break_duration": 25,
        }

    def test_onboarding_and_task_lifecycle(self):
        response = self.client.post("/api/profile/", self.payload, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.data["onboarding_completed"])
        task_id = response.data["tasks"][0]["id"]
        self.assertEqual(self.client.get("/api/profile/").status_code, 200)
        added = self.client.post("/api/profile/tasks/", {"title": "Practice LeetCode", "category": "Placement"}, format="json")
        self.assertEqual(added.status_code, 201)
        updated = self.client.patch(f"/api/profile/tasks/{task_id}/", {"completed": True}, format="json")
        self.assertEqual(updated.status_code, 200)
        self.assertTrue(updated.data["completed"])
        self.assertEqual(self.client.delete(f"/api/profile/tasks/{task_id}/").status_code, 204)

    def test_commitment_end_must_follow_start(self):
        self.payload["commitments"][0]["end"] = "08:00"
        response = self.client.post("/api/profile/", self.payload, format="json")
        self.assertEqual(response.status_code, 400)

    def test_planner_does_not_schedule_after_midnight_sleep_time(self):
        self.payload.update({"wake_up_time": "06:30", "sleep_time": "00:00", "preferred_study_time": "night", "daily_study_target": 6})
        self.payload["tasks"] = [{"title": f"Task {number}", "category": "Study Topic"} for number in range(6)]
        self.client.post("/api/profile/", self.payload, format="json")
        response = self.client.get("/api/planner/")
        self.assertEqual(response.status_code, 200)
        self.assertLessEqual(response.data["blocks"][-1]["end"], "23:59")
        self.assertGreater(response.data["unscheduled_tasks"], 0)
