import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';


import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {CallNumber} from '@ionic-native/call-number/ngx';
import {LaunchNavigator} from '@ionic-native/launch-navigator/ngx';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';

// Modal Pages
import {ImagePageModule} from './pages/modal/image/image.module';
import {SearchFilterPageModule} from './pages/modal/search-filter/search-filter.module';

// Components
import {NotificationsComponent} from './components/notifications/notifications.component';

@NgModule({
    declarations: [AppComponent, NotificationsComponent],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        HttpClientModule,
        ImagePageModule,
        SearchFilterPageModule,
    ],
    entryComponents: [NotificationsComponent],
    providers: [
        StatusBar,
        SplashScreen,
        CallNumber,
        LaunchNavigator,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
}
