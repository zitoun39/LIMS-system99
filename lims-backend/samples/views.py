from rest_framework import viewsets, permissions
from .models import Sample
from .serializers import SampleSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.http import HttpResponse
import csv

class SampleViewSet(viewsets.ModelViewSet):
    serializer_class = SampleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only show samples created by logged-in user
        return Sample.objects.filter(created_by=self.request.user)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def get_object(self):
        obj = super().get_object()
        if obj.created_by != self.request.user:
            raise PermissionDenied("You do not have permission to access this sample.")
        return obj

    @action(detail=False, methods=['get'])
    def export_csv(self, request):
        samples = self.get_queryset()
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="samples.csv"'

        writer = csv.writer(response)
        writer.writerow(['ID', 'Name', 'Description', 'Created At'])

        for s in samples:
            writer.writerow([s.id, s.name, s.description, s.created_at])

        return response

    @action(detail=False, methods=['post'])
    def import_csv(self, request):
        csv_file = request.FILES.get('file')
        if not csv_file:
            return Response({"error": "No file uploaded"}, status=400)

        decoded_file = csv_file.read().decode('utf-8').splitlines()
        reader = csv.DictReader(decoded_file)

        for row in reader:
            Sample.objects.update_or_create(
                id=row.get('ID'),
                defaults={
                    'name': row['Name'],
                    'description': row['Description'],
                    'created_by': request.user
                }
            )
        return Response({"status": "imported"})
