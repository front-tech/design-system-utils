
//
// tokens.font.m
//
// Do not edit directly
// Generated on Sat, 10 Apr 2021 11:59:22 GMT
//

#import ".h"

@implementation 

+ (NSDictionary *)getProperty:(NSString *)keyPath {
  return [[self properties] valueForKeyPath:keyPath];
}

+ (nonnull)getValue:(NSString *)keyPath {
  return [[self properties] valueForKeyPath:[NSString stringWithFormat:@"%@.value", keyPath]];
}

+ (NSDictionary *)properties {
  static NSDictionary * dictionary;
  static dispatch_once_t onceToken;

  dispatch_once(&onceToken, ^{
    dictionary = @{
  @"typography": @{
    @"Helvetica--Neue--35": @{
      @"family": @{
        @"value": helvetica--Neue--35,
        @"name": @"TypographyHelveticaNeue35Family",
        @"category": @"typography",
        @"type": @"Helvetica--Neue--35",
        @"item": @"family"
        },
      @"weight": @{
        @"value": 400,
        @"name": @"TypographyHelveticaNeue35Weight",
        @"category": @"typography",
        @"type": @"Helvetica--Neue--35",
        @"item": @"weight"
        },
      @"style": @{
        @"value": normal,
        @"name": @"TypographyHelveticaNeue35Style",
        @"category": @"typography",
        @"type": @"Helvetica--Neue--35",
        @"item": @"style"
        }
      },
    @"Helvetica--Neue--55": @{
      @"family": @{
        @"value": helvetica--Neue--55,
        @"name": @"TypographyHelveticaNeue55Family",
        @"category": @"typography",
        @"type": @"Helvetica--Neue--55",
        @"item": @"family"
        },
      @"weight": @{
        @"value": 400,
        @"name": @"TypographyHelveticaNeue55Weight",
        @"category": @"typography",
        @"type": @"Helvetica--Neue--55",
        @"item": @"weight"
        },
      @"style": @{
        @"value": normal,
        @"name": @"TypographyHelveticaNeue55Style",
        @"category": @"typography",
        @"type": @"Helvetica--Neue--55",
        @"item": @"style"
        }
      },
    @"Lato-regular": @{
      @"family": @{
        @"value": lato-regular,
        @"name": @"TypographyLatoRegularFamily",
        @"category": @"typography",
        @"type": @"Lato-regular",
        @"item": @"family"
        },
      @"weight": @{
        @"value": 400,
        @"name": @"TypographyLatoRegularWeight",
        @"category": @"typography",
        @"type": @"Lato-regular",
        @"item": @"weight"
        },
      @"style": @{
        @"value": normal,
        @"name": @"TypographyLatoRegularStyle",
        @"category": @"typography",
        @"type": @"Lato-regular",
        @"item": @"style"
        }
      },
    @"Gotham-italic": @{
      @"family": @{
        @"value": gotham-italic,
        @"name": @"TypographyGothamItalicFamily",
        @"category": @"typography",
        @"type": @"Gotham-italic",
        @"item": @"family"
        },
      @"weight": @{
        @"value": 300,
        @"name": @"TypographyGothamItalicWeight",
        @"category": @"typography",
        @"type": @"Gotham-italic",
        @"item": @"weight"
        },
      @"style": @{
        @"value": italic,
        @"name": @"TypographyGothamItalicStyle",
        @"category": @"typography",
        @"type": @"Gotham-italic",
        @"item": @"style"
        }
      }
    }
  };
  });

  return dictionary;
}

@end


