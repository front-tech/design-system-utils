# Design Systems Utils

Design Systems Utils aims to provide a series of common utilities at the beginning of any web project, which will facilitate and speed up the day-to-day development. For more information click on the following [link](https://front-tech.github.io/design-system-utils/).

Initially it will be necessary to install the ***@front-tech/design-systems-utils*** dependency by executing the following command ```npm install @front-tech/design-systems-utils```

For the correct functioning of the library it is necessary to create a configuration file in the project called ```.frontech.json``` which will determine the utilities of margin, padding and custom grid. This configuration must maintain the following structure:

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

To use the library, it will simply be necessary to create an npm script with the following syntax:
`design-systems-utils .frontech.json`

And then import the following file to your sass stylesheet:
`@use '~@front-tech/design-systems-utils/library/web/abstracts' with ($font-path:'public/assets/fonts/');`

We can also generate a css output of the library specifying in the configuration file the path where we want to export said file:

```
"outputCSS":{
    "path": "style.css"
  }
```

## Contributing to Front-tech

Thanks for contributing to front-tech development!
Feature requests and bug reports can be filed on [Github](https://github.com/front-tech/design-system-utils)

If you are contributing code with new features or bug-fixes:
- Fork the project, and create a branch for your contribution.
- Follow the development guide below to get design-systems-utils to work.
- Write the necessary documentation in ```library/web/**/*.scss```.
- Open a pull request on [Github](https://github.com/front-tech/design-system-utils/issues)

## Development
To install the necessary Node dependencies, run ```npm install```.

You can start up a local development server with ```npm run serve```.
Access the running server at ```http://localhost:3000```.