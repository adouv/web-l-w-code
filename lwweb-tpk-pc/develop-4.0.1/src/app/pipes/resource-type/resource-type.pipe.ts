import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
	name: 'resourceType',
})
export class ResourceTypePipe implements PipeTransform {
	private resourceTypes: { type: string; img: string }[];

	transform(value: string, ...args) {
		if (value) {
			const dianIndex = value.lastIndexOf('.');
			const key = value.slice(dianIndex + 1, value.length);
			const result = {status: false, src: null};
			for (const resource of this.resourceTypes) {
				if (resource.type.indexOf(key) !== -1) {
					result.status = true;
					result.src = resource.img;
					// return resource.img;
				}
			}
			// 其他文件
			if (!result.status) result.src = 'assets/images/filetype/other.png';
			return result.src;
		}
	}

	constructor() {
		this.resourceTypes = [
			{type: 'doc,docx', img: 'assets/images/filetype/word.png'},
			{type: 'ppt,pptx', img: 'assets/images/filetype/ppt.png'},
			{type: 'xls,xlsx', img: 'assets/images/filetype/excel.png'},
			{type: 'pdf', img: 'assets/images/filetype/pdf.png'},
			{type: 'txt', img: 'assets/images/filetype/txt.png'},
			{type: 'dwg', img: 'assets/images/filetype/dwg.png'},
			{type: 'rar,zip,7z', img: 'assets/images/filetype/zip.png'},
			{
				type: 'bmp, tif,tiff,dwg,eps,gif,ico,jpg,jpeg,png,pm5,raw,pcx,dxf,wmf,emf,lic,psd,swf,svg,cdr,tga,exif,fpx,pcd,ufo,ai',
				img: 'assets/images/filetype/picture.png'
			},
			{
				type: 'ra,ram,rm,rmv,brpm,realp,rt,smi,smil,scm,avi,mkv,ogm,mp4,m4v,m4p,m4b,dat,mpg,mpeg,' +
				'tp,ts,trp,pva,pss,vob,mpe,mv,m2ts,evo,asf,divx,wmv,vob,mov,mtv,3gp,amv,dmv,flv,qt,viv',
				img: 'assets/images/filetype/video.png'
			},
			{
				type: 'cda,wav,mp3,ra,,rma,wma,mid,midi,rmi,xmi,OGG,vqf,tvq,mod,ape,aif,aiff,au',
				img: 'assets/images/filetype/music.png'
			}
		];
	}
}
