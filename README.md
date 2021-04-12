### FRONTECH LIBRARY
Frontech Library aims to provide a series of common utilities at the beginning of any front project as well as certain mixins that facilitate day-to-day development such as margin, padding, grid classes, base animations and common elements. For more information launch the command ```npm run start``` and access the documentation in the browser under the port ```http://localhost:3000/```.

For the proper functioning of the library it is necessary to create a configuration file in the project called ```.frontech.json```, which will determine the utilities of margin, padding and custom grid. This configuration must maintain the following structure:
```
{
  "color": {
    "secondary_3": {
      "value": "rgba(203.00000309944153, 223.00000190734863, 144.00000661611557, 1)",
      "type": "color"
    },
    "secondary_2": {
      "value": "rgba(143.00000667572021, 173.00000488758087, 136.00000709295273, 1)",
      "type": "color"
    },
    "secondary_1": {
      "value": "rgba(127.00000002980232, 156.00000590085983, 150.0000062584877, 1)",
      "type": "color"
    },
    "primary_3": {
      "value": "rgba(155.00000596046448, 193.00000369548798, 219.0000021457672, 1)",
      "type": "color"
    },
    "primary_2": {
      "value": "rgba(20.000000707805157, 131.00000739097595, 187.00000405311584, 1)",
      "type": "color"
    },
    "primary_1": {
      "value": "rgba(0, 102.00000151991844, 153.00000607967377, 1)",
      "type": "color"
    }
  },
  "typography": {
    "Helvetica--Neue--35": {
      "family": {
        "value": "helvetica--Neue--35",
        "type": "typography"
      },
      "weight": {
        "value": 400,
        "type": "typography"
      },
      "style":{
        "value":"normal",
        "type":"typography"
      }
    },
    "Helvetica--Neue--55": {
      "family": {
        "value": "helvetica--Neue--55",
        "type": "typography"
      },
      "weight": {
        "value": 400,
        "type": "typography"
      },
      "style":{
        "value":"normal",
        "type":"typography"
      }
    },
    "Lato-regular": {
      "family": {
        "value": "lato-regular",
        "type": "typography"
      },
      "weight": {
        "value": 400,
        "type": "typography"
      },
      "style":{
        "value":"normal",
        "type":"typography"
      }
    },
    "Gotham-italic": {
      "family": {
        "value": "gotham-italic",
        "type": "typography"
      },
      "weight": {
        "value": 300,
        "type": "typography"
      },
      "style":{
        "value":"italic",
        "type":"typography"
      }
    },
    "icomoon": {
      "family": {
        "value": "icomoon",
        "input": "assets/icons",
        "output": "assets/fonts",
        "type": "typography"
      },
      "weight": {
        "value": "normal",
        "type": "typography"
      },
      "style":{
        "value":"normal",
        "type":"typography"
      }
    }
  },
  "grid": {
    "sm": {
      "gutter": {
        "value": "30px",
        "type": "grid"
      },
      "offset": {
        "value": "50px",
        "type": "grid"
      },
      "columns": {
        "value": 4,
        "type": "grid"
      },
      "width": {
        "value": "360px",
        "type": "grid"
      }
    },
    "md": {
      "gutter": {
        "value": "30px",
        "type": "grid"
      },
      "offset": {
        "value": "50px",
        "type": "grid"
      },
      "columns": {
        "value": 6,
        "type": "grid"
      },
      "width": {
        "value": "768px",
        "type": "grid"
      }
    },
    "lg": {
      "gutter": {
        "value": "30px",
        "type": "grid"
      },
      "offset": {
        "value": "50px",
        "type": "grid"
      },
      "columns": {
        "value": 12,
        "type": "grid"
      },
      "width": {
        "value": "1440px",
        "type": "grid"
      }
    }
  },
  "spacing":{
    "increase":{
        "value": 5,
        "type":"spacing"
    },
    "limit": {
        "value": 20,
        "type":"spacing"
    }
  },
  "outputCSS":{
    "path": "style.css"
  }
}
```

To use the library, it will simply be necessary to import the following file into your sass stylesheet:

```@use '~frontech-library/library/web/abstracts';```

We can also generate a css output of the library specifying in the configuration file the path where we want to export said file:

```
"outputCSS":{
    "path": "style.css"
  }
```

 <a id="media-queries-mixin-screen-sm"></a>

# @mixin screen-sm

Mixin whose objective is to create the media-query based on the cut points established in the configuration file

+ **Group:** Media-queries
+ **Access:** public

## Examples

```scss
.test{
   width: 100%;
   @include screen-sm(){
     width: auto;
   }
}
```

```css
.test {
   width: 100%;
 }

@media only screen and (min-width: 360px) {
   .test {
     width: auto;
   }
}
```

<a id="media-queries-mixin-screen-md"></a>

# @mixin screen-md

Mixin whose objective is to create the media-query based on the cut points established in the configuration file

+ **Group:** Media-queries
+ **Access:** public

## Examples

```scss
.test{
   width: 100%;
   @include screen-md(){
     width: auto;
   }
}
```

```css
.test {
   width: 100%;
 }

@media only screen and (min-width: 768px) {
   .test {
     width: auto;
   }
}
```

<a id="media-queries-mixin-screen-lg"></a>

# @mixin screen-lg

Mixin whose objective is to create the media-query based on the cut points established in the configuration file

+ **Group:** Media-queries
+ **Access:** public

## Examples

```scss
.test{
   width: 100%;
   @include screen-lg(){
     width: auto;
   }
}
```

```css
.test {
   width: 100%;
 }

@media only screen and (min-width: 1440px) {
   .test {
     width: auto;
   }
}
```
