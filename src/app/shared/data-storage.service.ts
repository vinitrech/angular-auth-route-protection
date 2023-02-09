import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {RecipesService} from "./recipesService";
import {Recipe} from "./recipe.model";
import {exhaustMap, map, take, tap} from "rxjs";
import {AuthService} from "../auth/auth.service";
import {User} from "../auth/user.model";

@Injectable({providedIn: 'root'})
export class DataStorageService {
  constructor(private httpClient: HttpClient, private recipesService: RecipesService, private authService: AuthService) { // HttpClient requires HttpClientModule to be imported in AppModule
  }

  storeRecipes() {
    const recipes = this.recipesService.getRecipes();
    this.httpClient.put('https://ng-course-recipe-book-9a1a0-default-rtdb.firebaseio.com/recipes.json', recipes).subscribe(response => {
      console.log(response);
    });
  }

  fetchRecipes() {
    return this.authService.loggedUser.pipe(take(1), exhaustMap(user => { // take will take the specified number of values then unsubscribe / exhaustMap will take the return value from the first observable, then exchange it with the new observable created inside the function
        return this.httpClient.get<Recipe[]>('https://ng-course-recipe-book-9a1a0-default-rtdb.firebaseio.com/recipes.json',
          {
            params: new HttpParams().set('auth', user ? user.token ? user.token : '' : '')
          });
      }),
      map(recipes => { // map is an operator, it operates on the array, and not each element
        return recipes.map(recipe => { // this map loops each item to perform operations
          return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
        });
      }),
      tap(recipes => {
        this.recipesService.setRecipes(recipes);
      })
    );
  }
}
