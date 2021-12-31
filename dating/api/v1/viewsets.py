from rest_framework import authentication, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.pagination import LimitOffsetPagination
import urllib.parse as urlparse
from urllib.parse import parse_qs

from dating.models import Match

from .serializers import (
    MatchSerializer,
)

class PostLimitOffsetPagination(LimitOffsetPagination):
    default_limit = 10

    def get_paginated_response(self, data):
        url = self.get_next_link()
        params = urlparse.urlparse(url)
        qs = parse_qs(params.query)
        offset = None
        limit = None

        if qs:
            offset = int(qs.get("offset")[0])
            limit = int(qs.get("limit")[0])

        return Response(
            {"count": self.count, "limit": limit, "offset": offset, "results": data}
        )

class MatchViewSet(viewsets.ModelViewSet):
    serializer_class = MatchSerializer
    authentication_classes = (
#        authentication.SessionAuthentication,
        authentication.TokenAuthentication,
    )
    queryset = Match.objects.all()
    pagination_class = PostLimitOffsetPagination


    @action(detail=False, methods=["get"])
    def followers(self, request):
        paginator = PostLimitOffsetPagination()
        user_id = request.data.get("user_id", request.user.id)
        match_query = Match.objects.filter(user__id = user_id)
        paginated_query = paginator.paginate_queryset(match_query, request)
        serializer = self.get_serializer(paginated_query, many=True)
        return paginator.get_paginated_response(serializer.data)

    @action(detail=False, methods=["get"])
    def following(self, request):
        paginator = PostLimitOffsetPagination()
        user_id = request.data.get("user_id", request.user.id)
        match_query = Match.objects.filter(owner__id = user_id)
        paginated_query = paginator.paginate_queryset(match_query, request)
        serializer = self.get_serializer(paginated_query, many=True)
        return paginator.get_paginated_response(serializer.data)


