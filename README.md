# 🚀 Getting Started
# 1. Clone the repo
```
git clone https://github.com/Temicruise007/SpotSocially-Web-Application.git
cd SpotSocially-Web-Application
```

# 2. Backend Setup
```
cd Node-backend
npm install
cp .env.example .env
 👉 Fill in your .env with:
    DB_USER, DB_PASSWORD, DB_NAME
    JWT_SECRET_KEY
    (v2.0) AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_BUCKET_NAME, AWS_REGION
npm run start
```
By default the server listens on http://localhost:5000.

# 3. Frontend Setup
```
cd ../React-frontend
npm install
cp .env.example .env
 👉 Fill in your .env with:
    REACT_APP_BACKEND_URL = your_backend_api_endpoint
    REACT_APP_ASSET_URL = your_app_asset_api_endpoint
    REACT_APP_GOOGLE_MAPS_API_KEY = your_google_maps_key
npm start
```
By default the React app on this web app, runs on http://localhost:3000.

# 🔧 Environment Variables
```
DB_USER=yourMongoUser
DB_PASSWORD=yourMongoPassword
DB_NAME=yourDatabaseName
JWT_SECRET_KEY=someVerySecretString

 (v2.0 AWS S3 integration)
AWS_ACCESS_KEY_ID=AKIA…
AWS_SECRET_ACCESS_KEY=…
AWS_S3_BUCKET_NAME=spot­socially­images
AWS_REGION=us-east-1
```

```
REACT_APP_BACKEND_URL = your_backend_url
REACT_APP_ASSET_URL = your_app_asset_url
REACT_APP_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
```


# 🎯 Features & Roadmap
## - ✅ v1.0

- Local image upload

- JWT signup/login

- CRUD for places & users

## - 🚧 v2.0 (in progress)

- Migrate image storage to AWS S3

- Persist S3 URLs in MongoDB

- Email verification: send confirmation emails on signup & block unverified addresses


# 🤝 Contributing
- Fork the repo

- Create a feature branch (git checkout -b feature/awesome)

- Commit your changes (git commit -m "Add awesome feature" [an example])

- Push to your branch (git push origin feature/awesome)

- Open a Pull Request

- Please follow the existing code style and include tests where applicable.
