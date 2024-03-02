# Hater: Table of Contents

- [Link to Live Site](#link-to-live-site)
- [Description](#description)
- [Technologies](#technologies)
- [Features](#features)
- [Installation](https://github.com/SejuSpeaks/Hater/tree/readme-update?tab=readme-ov-file#installation)
- [Contributors](https://github.com/SejuSpeaks/Hater/tree/readme-update?tab=readme-ov-file#installation)

<br>

## Link to Live Site

[Hater](https://github.com/SejuSpeaks/Hater/wiki/Link-to-Live-Site)

## Description

Hater is a music review site. Users can add their personal albums, search for other user albums and leave reviews on other albums.


## Technologies

### Frameworks, Platforms and Libraries:
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" style="width:75px;" />
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg" style="width:75px;" />
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flask/flask-original.svg" style="width:75px;" />
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-plain-wordmark.svg" style="width:75px;" />
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-plain-wordmark.svg" style="width:75px;" />


### Database:
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-plain.svg" style="width:75px;" />

### Other:
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-plain.svg" style="width:75px;" />
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original-wordmark.svg" style="width:75px;" />

<br>

## Features

- The landing page displays albums added to platform
- Users can sign up for an account
- Users can log into existing accounts
- Authenticated users can add their own albums
- Authenticated users can manage albums they own by making updates and/or deleting
- Authenticated users can leave rating and reviews for album they do not own
- Authenticated users can like albums and view albums they have liked
- Authenticated users view all reviewed, liked and owned albums via the My Albums page
- Unauthenticated users can view album details for all albums on the platform including reviews for each album
- Unauthenticated users can search by title, artist, genre, description

## Installation

   ### 1. Clone the repository
      ```sh
      git clone https://github.com/SejuSpeaks/Hater.git
      cd hater
      ```
   ### 2. Install npm dependencies
      ```sh
      npm install
      ```
   ### 3. Copy the environment variables to .env and change the values
      ``` sh
      cp .env.example .env
      ```
   ### 4. Initialize the database
      ``` sh
      pipenv shell
      flask db upgrade
      flask seed all
      flask run
      ```
   ### 5. Run the dev server
      ```sh
      npm run dev
      ```
   ### 6. Open the app in your browser

      Visit http://localhost:3000 in your browser.

<br>

## Contact Information
-[**Jael Bueno**](https://api.github.com/users/SejuSpeaks)

-[**Katharine Arburn**](https://api.github.com/users/KatharineArburn)

-[**Tony Garcia**](https://api.github.com/users/triplegdev)

-[**Hannah Guertler**](https://api.github.com/users/h-guertler)


