# Patient Care Management System

## Overview

This project is designed to manage patient records, including handling clinical attachments such as MRI scans, CAT scans, and doctor's reports. The system provides functionality for managing patient data and clinical documents with features such as:

- Create, update, retrieve, and delete patient records.
- Upload and associate clinical attachments (MRI, CAT scans, doctor's reports) with patient records.
- Search functionality to filter patients based on criteria such as name, medical condition, and attached document type.

## Features

- **Patient Records Management**: Create, update, retrieve, and delete patient records.
- **Clinical Attachments**: Upload, store, and associate clinical files with patient records.
- **Search Functionality**: Filter patients based on name, medical condition, or attachment type.
- **File Storage**: Store uploaded attachments in a local directory or on a cloud storage service (e.g., AWS S3).
  
## Technologies Used

- **Backend**: Node.js with Express.js
- **File Uploads**: Multer for handling file uploads
- **Database**: PostgreSQL for storing patient records
- **Security**: JWT for user authentication

## API Endpoints

### 1. **Create a Patient Record**
- **Method**: `POST`
- **Endpoint**: `/patients`
- **Request Body**:
    ```json
    {
        "id": "string",
        "name": "string",
        "age": "integer",
        "contactDetails": "string",
        "medicalHistory": "string"
    }
    ```

### 2. **Retrieve a Patient Record**
- **Method**: `GET`
- **Endpoint**: `/patients/{id}`
- **Response**:
    ```json
    {
        "id": "string",
        "name": "string",
        "age": "integer",
        "contactDetails": "string",
        "medicalHistory": "string",
        "attachments": [
            {
                "filename": "file1.pdf",
                "path": "path/to/file1.pdf"
            }
        ]
    }
    ```

### 3. **Search Patients**
- **Method**: `GET`
- **Endpoint**: `/patients`
- **Query Parameters**:
    - `name`: Patient name.
    - `medicalCondition`: Medical condition to filter by.
- **Response**:
    ```json
    [
        {
            "id": "string",
            "name": "string",
            "age": "integer",
            "contactDetails": "string",
            "medicalHistory": "string",
            "attachments": []
        }
    ]
    ```

### 4. **Upload and Associate Attachment**
- **Method**: `POST`
- **Endpoint**: `/attachments`
- **Form Data**:
    - `attachment`: File (e.g., MRI scan, doctor's report).
    - `patientId`: ID of the patient to associate the attachment with.
- **Response**:
    ```json
    {
        "message": "Attachment uploaded successfully",
        "attachment": {
            "filename": "file1.pdf",
            "path": "path/to/file1.pdf"
        }
    }
    ```

## How to Run the Project

1. Clone the repository:
    ```bash
    git clone https://github.com/geekycoder28/patient-care-management-system.git
    cd patient-care-management-system
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Run the server:
    ```bash
    npm start
    ```

The server will start running at [http://localhost:3000](http://localhost:3000).

## Security Considerations

- Authentication is handled using JWT to secure access to patient records and attachments.
- Input validation and file type restrictions are implemented to prevent malicious uploads.
