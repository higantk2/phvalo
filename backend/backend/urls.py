from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    
    # Djoser Auth URLs
    path("auth/", include("djoser.urls")),
    path("auth/", include("djoser.urls.jwt")),
    
    # Favorites App
    path("api/favorites/", include("favorites.urls")),
]