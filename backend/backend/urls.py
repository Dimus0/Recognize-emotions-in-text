from django.contrib import admin
from django.urls import path
from ..api.views import EmotionView

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/recognition-emotion",EmotionView.as_view())
]
