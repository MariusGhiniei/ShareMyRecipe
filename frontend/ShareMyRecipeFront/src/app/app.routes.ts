import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { PostComponent } from './components/post/post.component';
import { FeedComponent } from './components/feed/feed.component';


export const routes: Routes = [
    
    {
        path : '',
        component : HomeComponent,
    },
    {
        path : 'login',
        component : LoginComponent
    },
    {
        path : 'register',
        component : RegisterComponent
    },
    {
        path: 'post',
        component : PostComponent
    },
    {
        path: 'feed',
        component : FeedComponent
    }
];
