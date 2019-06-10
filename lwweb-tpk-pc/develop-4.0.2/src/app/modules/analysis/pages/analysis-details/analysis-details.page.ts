import { FileInterface } from './../../../../services/file/file.interface';
import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AnalysisInterface } from '../../services/analysis.interface';
import { DateToWeekPipe } from '../../../../pipes/date/dateToWeek';
import { FilePreviewService } from '../../../../services/file/file-preview.service';
import { LwClientService } from '../../../../common/client';
import { EnvDefaultConfig, fileCode } from '../../../../app.export';
import { NotificationService } from '../../../../extend/notification/notification.service';
import { AccountService } from '../../../../services/account';
import { DialogService } from '../../../../services/dialog/dialog.service';
@Component({
    templateUrl: './analysis-details.page.html',
    styleUrls: ['./analysis-details.page.scss']
})
export class AnalysisDetailsPageComponent implements OnInit {
    startDate: any;
    endDate: any;
    gradeId: any;
    subjectCode: any;
    detailsDate: any;
    lessonId: any;
    detailsData: any;
    courseMaterials: any;
    timer: any;
    allowImgType: Array<string>;
    videoType: Array<string>;
    isDouble: boolean;
    imgData = {};
    isPreviewDialog = false;
    firstStartDate: any;
    firstEndDate: any;
    downloadList: any = [];
    showDownloadBtn: boolean;
    constructor(private router: Router,
        private analysisInterface: AnalysisInterface,
        private dateToWeekPipe: DateToWeekPipe,
        private clientService: LwClientService,
        private filePreviewService: FilePreviewService,
        private fileInterface: FileInterface,
        private envDefaultConfig: EnvDefaultConfig,
        private accountService: AccountService,
        private notification: NotificationService,
        private activatedRoute: ActivatedRoute,
        private dialogService: DialogService) {
        this.detailsData = {};
        this.isDouble = false;
        this.allowImgType = ['jpg', 'jpeg', 'png', 'gif'];
        this.videoType = ['mp4', 'flv'];
        this.getRouterParams();
    }

    ngOnInit() {
        this.getMaterialDetail();
        this.getAllMaterials();
    }

    goHome() {
        this.router.navigate(['../home'], {
            queryParams: {
                startDate: this.firstStartDate,
                endDate: this.firstEndDate,
            }, relativeTo: this.activatedRoute
        })
    }
    goList() {
        this.router.navigate(['../list'], {
            queryParams: {
                startDate: this.startDate,
                endDate: this.endDate,
                gradeId: this.gradeId,
                firstStartDate: this.firstStartDate,
                firstEndDate: this.firstEndDate,
                subjectCode: this.subjectCode
            }, relativeTo: this.activatedRoute
        })
    }
    getRouterParams() {
        this.activatedRoute.queryParams.subscribe(queryParams => {
            this.startDate = queryParams.startDate;
            this.endDate = queryParams.endDate;
            this.firstStartDate = queryParams.firstStartDate;
            this.firstEndDate = queryParams.firstEndDate;
            this.gradeId = queryParams.gradeId;
            this.subjectCode = queryParams.subjectCode;
            this.detailsDate = queryParams.detailsDate;
            this.lessonId = queryParams.lessonId;
        });
    }
    getAllMaterials() {
        this.analysisInterface.getAllMaterials(this.lessonId, this.detailsDate).subscribe((data) => {
            console.log(data);
            this.courseMaterials = data;
        })
    }
    getMaterialDetail() {
        this.analysisInterface.getMaterialDetail(this.lessonId, this.detailsDate).subscribe((data) => {
            console.log(data);
            this.detailsData = data;
            this.detailsData.weekText = this.dateToWeekPipe.transform(this.detailsData.date);
            console.log(this.detailsData);
        })
    }
    /**
	 * 预览图片
	 * @param data
	 */
    openImg(data) {
        const imgLists = this.getImages(this.courseMaterials),
            ids = this.getIds(imgLists),
            type = this.getSuffixName(data.name),
            filePath = this.envDefaultConfig.getHttpServerUrl(fileCode.SHOW_IMG) + encodeURIComponent(data.path),
            videoPath = this.envDefaultConfig.getHttpServerUrl(fileCode.SHOW_IMG) + data.path;
        let index = 0;

        if (this.videoType.indexOf(type) > -1) {  // 预览视频 mp4、flv
            this.getVideoUrl(data.path, (data) => {
                this.filePreviewService.videoPreview(data.pcPlayUrl, '视频预览');
            })
        } else if (this.allowImgType.indexOf(type) > -1) {  // 预览图片
            for (const item of ids) {
                if (item === data.id) {
                    index = ids.indexOf(item);
                }
            }
            this.filePreviewService.imgPreview(imgLists, index);
        } else {
            this.previewFile(filePath, data.name);
        }
    }
    download(data) {
        const fileServerUrl = this.envDefaultConfig.getHttpServerUrl(fileCode.DOWNLOAD) + encodeURIComponent(data.path);
        this.showDownloadBtn = true;
        data.success = false;
        data.downloading = true;
        this.downloadList.push(data);
        try {
            this.clientService.download(fileServerUrl, this.clientService.getAppPath().download + data.name).subscribe(res => {
                data.filePath = res;
                data.success = true;
                data.downloading = false;
                this.dialogService.alertSuccess('下载成功！');
                this.downloadList.push(data);
            }, err => {
                data.downloading = false;
                this.dialogService.alertWarning('当前网络不稳定，下载失败！');
                //this.dialogService.alertWarning('网络原因，请稍后重试');
                this.downloadList.push(data);
            });
        } catch (e) {
            data.downloading = false;
            this.dialogService.alertWarning(e.message);
            this.downloadList.push(data);
        }
    }
    getIds(list) {
        const ids = [];
        for (const data of list) {
            ids.push(data.id);
        }
        return ids;

    }
    /**
	 * 获取图片名称
	 * @param list
	 * @returns {any[]}
	 */
    private getImages(list) {
        const imgList = [];
        for (const item of list) {
            const type = this.getSuffixName(item.name);
            if (this.allowImgType.indexOf(type) > -1) {
                imgList.push(item);
            }
        }
        return imgList;
    }
    private getSuffixName(name: string) {
        return name.substr(name.lastIndexOf('.') + 1).toLocaleLowerCase();
    }
    /**
	 * 预览文件
	 * @param path
	 * @param name
	 */
    private previewFile(path, name) {
        this.clientService.previewFile(path, name.replace(/ /g, '')).subscribe(preview => {
            console.log(preview);
        }, err => {
            this.notification.error('预览失败', '暂不支持该格式文件');
        });
    }

    private getVideoUrl(url, callback) {
        this.analysisInterface.getPlayUrl(this.accountService.getCurrentGardenId(), url).subscribe((data) => {
            callback(data);
        })
    }
}
