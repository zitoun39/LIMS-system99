FROM python:3.10-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

COPY requirements.txt /app/
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY . /app/

RUN python manage.py migrate

EXPOSE 8000

CMD ["gunicorn", "lims_project.wsgi:application", "--bind", "0.0.0.0:8000"]
