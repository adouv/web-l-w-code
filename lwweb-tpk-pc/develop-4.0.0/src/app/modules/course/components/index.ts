import { CourseTimeTableComponent } from './timetable/time.table';
import { CourseSpaceComponent } from './space/space';
import { ExerciseTopic } from './exercise/exercise-topic.component';
import { ExerciseModule } from './exercise/exercise-module.component';
import { ProgressItemComponent } from './file-item/file-item';
import { UploaderDialogComponent } from './upload-dialog/uploader';
import {
	CarouselModule, CheckboxModule, ConfirmDialogModule,
	DropdownModule, MultiSelectModule, TabViewModule,
	ButtonModule, GrowlModule, DialogModule
} from 'primeng/primeng';
import { UEditorModule } from 'lw-ngx-ueditor';
import { FileUploaderCourseComponent } from './uploader/uploader';
import { ExerciseHandleTip } from './exercise/exercise-handle.component';
import { CourseClassTableComponent } from './classtable/class.table';
import { ImageDialogComponent } from './image/image';
import { MessageService } from 'primeng/components/common/messageservice';
import { ConfirmationService } from 'primeng/api';
import { CoursewareHeaderComponent } from './courseware-header/courseware-header.component';
import { SelectCourseChapterComponent } from './select-chapter/select-chapter';
import { TreeCourseComponent } from './dialog-tree/dialog-tree';
import { DialogTimetableComponent } from './dialog-timetable/dialog-timetable.component';
import { ExercisesCard } from '../../resource-classes/components/exercises-card/exercises-card';
export const courseComponents = [
	CourseClassTableComponent,
	CourseTimeTableComponent,
	FileUploaderCourseComponent,
	CourseSpaceComponent,
	ExerciseHandleTip,
	ExerciseModule,
	ExerciseTopic,
	ExercisesCard,
	ImageDialogComponent,
	ProgressItemComponent,
	UploaderDialogComponent,
	CoursewareHeaderComponent,
	SelectCourseChapterComponent,
	TreeCourseComponent,
	DialogTimetableComponent
];

export const primeNgModules = [
	DialogModule,
	DropdownModule,
	CarouselModule,
	ConfirmDialogModule,
	MultiSelectModule,
	CheckboxModule,
	TabViewModule,
	ButtonModule,
	GrowlModule,
	UEditorModule.forRoot({
		// 指定ueditor.js路径目录
		path: 'assets/ueditor/',
		// 默认全局配置项
		options: {
			themePath: '/assets/ueditor/themes/'
		}
	})
];

export const primeNgServices = [
	MessageService,
	ConfirmationService
];
