# BISI: Base d'intégration Semaine Intensive

## Bower:
### Intall Bower w/ Yarn
```shell
  $ yarn global add bower
```

### Intall Bower w/ Npm
```shell
  $ npm install -g bower
```

## Gulp 4:
### Intall Gulp 4 w/ Yarn
```shell
  $ yarn global remove gulp
  $ yarn global add gulp-cli
```

### Intall Gulp 4 w/ Npm
```shell
  $ npm rm -g gulp
  $ npm install -g gulp-cli
```

## Usage:
### Yarn
```shell
  $ bower install
  $ yarn
  $ gulp
```

### Npm
```shell
  $ bower install
  $ npm i
  $ gulp
```

## DOC:
  - CSS: Project css goes into scss/inc/project
  - CSS: Fonts && vars css goes into scss/inc/core
  - JS: class ie is added to the body tag if the browser is IE
  - JS: class wa add the class animate to an element if it enter the window scope
  - JS: function requestAnimationFrame -> check if the browser has the resources to load an animation
  - JS: jQuery has been added through bower
