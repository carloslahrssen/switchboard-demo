# Switchboard exercise

## Part 1 Webhook processing

### Prerequisites

This is assuming that you have python3 installed.

### Running the server

To run this project locally run the following command

`cd backend && python3 -m venv .venv`  

`. .venv/bin/activate`  

`python run.py && flask run`  


The webhook route is on `http://127.0.0.1:5000/actblue_donation`

### Implementation details

- Each request is assuming that you are using the following credentials for basic auth
  - Username: actblue
  - Password: CHANGEME
  
## Part 2 Frontend dashboard

The frontend is built using NextJS v13. It also utilizies shadcn for components. Styling is done with tailwind.

### Important note about the implementation of this project

For this challenge there was a section about switching between 1 day, 7 days and all time of the created date for retrieving the aggregate amount. However, the CSV data was from september 30th, 2023. Meaning that selecting this would yield $0 for options 1 and 7. Rather than doctor the data to work. I instead changed the behavior of the aggregate to get x amount of days before the ~last~ donation. The code is set up in a way to very easily change this to be based on the current date if such a change would be required in the future.

### Frontend Prerequisites

To run the frontend have the following installed

- npm (I'm using version 10.5.1)
- node (Using 22.0.0)

### Running the frontend server

1. `cd frontend` (Assuming that you're in the parent directory which contains the frontend and backend folder)
1. `npm install`
1. `npm run dev`
1. Visit `http://localhost:3000` in your browser and you will be automatically redirected to `/dashboard/` which is where the demo lives.
