from django.shortcuts import render
from rest_framework import viewsets
from .models import *
from .serializers import WatchlistItemSerializer

# Create your views here.
class WatchlistItemViewSet(viewsets.ModelViewSet):
    queryset = WatchlistItem.objects.all().order_by('-added_on')
    serializer_class = WatchlistItemSerializer