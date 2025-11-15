from django.urls import path
from .views import (
    FavoriteListCreate, 
    FavoriteDelete, 
    MostFavoritedAgentsView, 
    UserFavoritesSearchView,
    FavoriteWeaponListCreate,
    FavoriteWeaponDelete,
    MostFavoritedWeaponsView # <-- NEW
)

urlpatterns = [
    # Agent Leaderboard
    path("top/", MostFavoritedAgentsView.as_view(), name="most-favorited-agents"), 
    
    # NEW: Weapon Leaderboard
    path("top/weapons/", MostFavoritedWeaponsView.as_view(), name="most-favorited-weapons"),

    # User Search (for agents)
    path("search/", UserFavoritesSearchView.as_view(), name="search-favorites"),

    # Agent Favorites
    path("", FavoriteListCreate.as_view(), name="favorite-list-create"),
    path("<int:pk>/", FavoriteDelete.as_view(), name="favorite-delete"),
    
    # Weapon Favorites
    path("weapons/", FavoriteWeaponListCreate.as_view(), name="favorite-weapon-list-create"),
    path("weapons/<int:pk>/", FavoriteWeaponDelete.as_view(), name="favorite-weapon-delete"),
]