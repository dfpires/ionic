import { NgModule } from '@angular/core';
import { CustomLoggedHeaderComponent } from './custom-logged-header/custom-logged-header';
import { MessageBoxComponent } from './message-box/message-box';
import { UserInfoComponent } from './user-info/user-info';
import { UserMenuComponent } from './user-menu/user-menu';
import { ProgressBarComponent } from './progress-bar/progress-bar';
@NgModule({
	declarations: [CustomLoggedHeaderComponent,
    MessageBoxComponent,
    UserInfoComponent,
    UserMenuComponent,
    ProgressBarComponent],
	imports: [],
	exports: [CustomLoggedHeaderComponent,
    MessageBoxComponent,
    UserInfoComponent,
    UserMenuComponent,
    ProgressBarComponent]
})
export class ComponentsModule {}
