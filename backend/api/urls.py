from django.urls import path, include
from rest_framework import routers
from .views import *

router = routers.DefaultRouter()
router.register(r'watchlist', WatchlistItemViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
