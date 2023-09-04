# Use an official Python runtime as a parent image
FROM python:3.8



# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install gcc and related build tools
RUN apt-get update && \
    apt-get install -y gcc && \
    apt-get clean

RUN apt-get update && apt-get install -y libgl1-mesa-glx


# Install any needed packages specified in requirements.txt
RUN pip install -r requirements.txt

# Make port 80 available to the world outside this container
EXPOSE 80

# Define environment variable for Flask
ENV FLASK_APP=app.py

# Run the Flask application
CMD ["flask", "run", "--host=0.0.0.0"]