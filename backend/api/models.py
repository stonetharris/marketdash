from django.db import models

# Create your models here.

class WatchlistItem(models.Model):
    ticker = models.CharField(max_length=10)
    added_on = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.ticker