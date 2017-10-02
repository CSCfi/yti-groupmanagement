# Group management

## Development

Get started:

  - Copy `web-api/src/main/resources/config/application-dev.properties` to `application-local.properties`
    and adjust the settings.
  - Run `./gradlew assemble` to download all dependencies.

To develop the code:

  - Run java class `fi.vm.yti.groupmanagement.Main` with parameter `-Dspring.profiles.active=local` in `web-api` to start up Spring Boot web application at [http://localhost:8002](http://localhost:8002).
  - Run `npm start` in `frontend` to start up webpack dev server

Now you can start hacking the code normally.
