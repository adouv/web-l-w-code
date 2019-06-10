import {Pipe, PipeTransform} from '@angular/core';

/**
 * Generated class for the FiletypePipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
	name: 'filetype',
})
export class FiletypePipe implements PipeTransform {
	public static WORD = 'assets/images/filetype/word.png';
	public static PDF = 'assets/images/filetype/pdf.png';
	public static PPT = 'assets/images/filetype/ppt.png';
	public static EXCEL = 'assets/images/filetype/excel.png';

	private filetypeMap: Map<string, string>;

	/**
	 * Takes a value and makes it lowercase.
	 */
	transform(value: string, ...args) {
		if (!value) {
			return;
		}
		const dianIndex = value.lastIndexOf('.');
		const key = value.slice(dianIndex + 1, value.length);
		if (this.filetypeMap.get(key) === undefined) {
			return 'assets/images/filetype/other.png';
		}
		return this.filetypeMap.get(key);
	}

	constructor() {
		this.filetypeMap = new Map();
		this.filetypeMap.set('doc', 'assets/images/filetype/word.png');
		this.filetypeMap.set('docx', 'assets/images/filetype/word.png');
		this.filetypeMap.set('ppt', 'assets/images/filetype/ppt.png');
		this.filetypeMap.set('pptx', 'assets/images/filetype/ppt.png');
		this.filetypeMap.set('xlsx', 'assets/images/filetype/excel.png');
		this.filetypeMap.set('xls', 'assets/images/filetype/excel.png');

		this.filetypeMap.set('pdf', 'assets/images/filetype/pdf.png');
		this.filetypeMap.set('txt', 'assets/images/filetype/txt.png');
		this.filetypeMap.set('dwg', 'assets/images/filetype/dwg.png');

		this.filetypeMap.set('rar', 'assets/images/filetype/zip.png');
		this.filetypeMap.set('zip', 'assets/images/filetype/zip.png');
		this.filetypeMap.set('7z', 'assets/images/filetype/zip.png');

		this.filetypeMap.set('bmp', 'assets/images/filetype/picture.png');
		this.filetypeMap.set('tif', 'assets/images/filetype/picture.png');
		this.filetypeMap.set('tiff', 'assets/images/filetype/picture.png');
		this.filetypeMap.set('dwg', 'assets/images/filetype/picture.png');
		this.filetypeMap.set('eps', 'assets/images/filetype/picture.png');
		this.filetypeMap.set('gif', 'assets/images/filetype/picture.png');
		this.filetypeMap.set('ico', 'assets/images/filetype/picture.png');
		this.filetypeMap.set('jpg', 'assets/images/filetype/picture.png');
		this.filetypeMap.set('jpeg', 'assets/images/filetype/picture.png');
		this.filetypeMap.set('png', 'assets/images/filetype/picture.png');
		this.filetypeMap.set('pm5', 'assets/images/filetype/picture.png');
		this.filetypeMap.set('raw', 'assets/images/filetype/picture.png');
		this.filetypeMap.set('pcx', 'assets/images/filetype/picture.png');
		this.filetypeMap.set('dxf', 'assets/images/filetype/picture.png');
		this.filetypeMap.set('wmf', 'assets/images/filetype/picture.png');
		this.filetypeMap.set('emf', 'assets/images/filetype/picture.png');
		this.filetypeMap.set('lic', 'assets/images/filetype/picture.png');
		this.filetypeMap.set('psd', 'assets/images/filetype/picture.png');
		this.filetypeMap.set('swf', 'assets/images/filetype/picture.png');
		this.filetypeMap.set('svg', 'assets/images/filetype/picture.png');
		this.filetypeMap.set('cdr', 'assets/images/filetype/picture.png');
		this.filetypeMap.set('tga', 'assets/images/filetype/picture.png');
		this.filetypeMap.set('exif', 'assets/images/filetype/picture.png');
		this.filetypeMap.set('fpx', 'assets/images/filetype/picture.png');
		this.filetypeMap.set('pcd', 'assets/images/filetype/picture.png');
		this.filetypeMap.set('ufo', 'assets/images/filetype/picture.png');
		this.filetypeMap.set('ai', 'assets/images/filetype/picture.png');

		this.filetypeMap.set('ra', 'assets/images/filetype/video.png');
		this.filetypeMap.set('ram', 'assets/images/filetype/video.png');
		this.filetypeMap.set('rm', 'assets/images/filetype/video.png');
		this.filetypeMap.set('rmvb', 'assets/images/filetype/video.png');
		this.filetypeMap.set('rpm', 'assets/images/filetype/video.png');
		this.filetypeMap.set('realpix', 'assets/images/filetype/video.png');
		this.filetypeMap.set('rt', 'assets/images/filetype/video.png');
		this.filetypeMap.set('smi', 'assets/images/filetype/video.png');
		this.filetypeMap.set('smil', 'assets/images/filetype/video.png');
		this.filetypeMap.set('scm', 'assets/images/filetype/video.png');
		this.filetypeMap.set('avi', 'assets/images/filetype/video.png');
		this.filetypeMap.set('mkv', 'assets/images/filetype/video.png');
		this.filetypeMap.set('ogm', 'assets/images/filetype/video.png');
		this.filetypeMap.set('mp4', 'assets/images/filetype/video.png');
		this.filetypeMap.set('m4v', 'assets/images/filetype/video.png');
		this.filetypeMap.set('m4p', 'assets/images/filetype/video.png');
		this.filetypeMap.set('m4b', 'assets/images/filetype/video.png');
		this.filetypeMap.set('dat', 'assets/images/filetype/video.png');
		this.filetypeMap.set('mpg', 'assets/images/filetype/video.png');
		this.filetypeMap.set('mpeg', 'assets/images/filetype/video.png');
		this.filetypeMap.set('tp', 'assets/images/filetype/video.png');
		this.filetypeMap.set('ts', 'assets/images/filetype/video.png');
		this.filetypeMap.set('trp', 'assets/images/filetype/video.png');
		this.filetypeMap.set('pva', 'assets/images/filetype/video.png');
		this.filetypeMap.set('pss', 'assets/images/filetype/video.png');
		this.filetypeMap.set('vob', 'assets/images/filetype/video.png');
		this.filetypeMap.set('mpe', 'assets/images/filetype/video.png');
		this.filetypeMap.set('mv', 'assets/images/filetype/video.png');
		this.filetypeMap.set('m2ts', 'assets/images/filetype/video.png');
		this.filetypeMap.set('evo', 'assets/images/filetype/video.png');
		this.filetypeMap.set('asf', 'assets/images/filetype/video.png');
		this.filetypeMap.set('divx', 'assets/images/filetype/video.png');
		this.filetypeMap.set('wmv', 'assets/images/filetype/video.png');
		this.filetypeMap.set('vob', 'assets/images/filetype/video.png');
		this.filetypeMap.set('mov', 'assets/images/filetype/video.png');
		this.filetypeMap.set('mtv', 'assets/images/filetype/video.png');
		this.filetypeMap.set('3gp', 'assets/images/filetype/video.png');
		this.filetypeMap.set('amv', 'assets/images/filetype/video.png');
		this.filetypeMap.set('dmv', 'assets/images/filetype/video.png');
		this.filetypeMap.set('flv', 'assets/images/filetype/video.png');
		this.filetypeMap.set('qt', 'assets/images/filetype/video.png');
		this.filetypeMap.set('viv', 'assets/images/filetype/video.png');


		this.filetypeMap.set('cda', 'assets/images/filetype/music.png');
		this.filetypeMap.set('wav', 'assets/images/filetype/music.png');
		this.filetypeMap.set('mp3', 'assets/images/filetype/music.png');
		this.filetypeMap.set('ra', 'assets/images/filetype/music.png');
		this.filetypeMap.set('rma', 'assets/images/filetype/music.png');
		this.filetypeMap.set('wma', 'assets/images/filetype/music.png');
		this.filetypeMap.set('mid', 'assets/images/filetype/music.png');
		this.filetypeMap.set('midi', 'assets/images/filetype/music.png');
		this.filetypeMap.set('rmi', 'assets/images/filetype/music.png');
		this.filetypeMap.set('xmi', 'assets/images/filetype/music.png');
		this.filetypeMap.set('OGG', 'assets/images/filetype/music.png');
		this.filetypeMap.set('vqf', 'assets/images/filetype/music.png');
		this.filetypeMap.set('tvq', 'assets/images/filetype/music.png');
		this.filetypeMap.set('mod', 'assets/images/filetype/music.png');
		this.filetypeMap.set('ape', 'assets/images/filetype/music.png');
		this.filetypeMap.set('aif', 'assets/images/filetype/music.png');
		this.filetypeMap.set('aiff', 'assets/images/filetype/music.png');
		this.filetypeMap.set('au', 'assets/images/filetype/music.png');
	}

}
