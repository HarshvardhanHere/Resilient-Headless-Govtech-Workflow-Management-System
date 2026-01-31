# Resilient Headless GovTech Workflow Management System

## Project Overview
This system is an automated solution designed to manage complex government administrative procedures without manual intervention. It utilizes a headless architecture to interface between legacy public sector portals and modern data processing engines.

## Technical Architecture
* **State Management and Reliability**: The core reliability layer is powered by Temporal to ensure that every administrative workflow is fault tolerant and maintains its state across potential system failures.
* **Workflow Orchestration**: n8n is utilized for the rapid orchestration of complex logic and visual management of high level business processes.
* **API Integration**: A custom TypeScript bridge facilitates communication with external portals, specifically handling notification requests and data transfers.
* **Containerization**: The entire infrastructure is deployed using Docker Compose to ensure consistency across development and production environments.

## Core Components
* **API Bridge**: Located in the bridge for api directory, this component manages the communication between the workflow engine and external notification services.
* **Automation Engine**: The 'chal ja n8n' directory contains the configuration for the orchestration layer, including the database and environment settings.
* **Frontend Interface**: The project includes a sample interface for the teacher transfer process to demonstrate the end to end flow of information.

## Technology Stack
* **Orchestration**: n8n
* **Reliability**: Temporal
* **Languages**: TypeScript and Node.js
* **Infrastructure**: Docker and Docker Compose
* **Database**: PostgreSQL
