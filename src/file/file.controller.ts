import { Controller, Get, Post, Put, Delete, Param, Body, UseInterceptors, UploadedFile, Res, NotFoundException } from "@nestjs/common";
import { FileService } from "./file.service";
import { File } from "./file.model";
import { CreateFileDto } from "./dto/create-file.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { mkdirSync } from "fs";
import { diskStorage } from "multer";
import { extname } from "path";
import { Response as ExpressResponse } from "express";
@Controller("files")
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post("/upload/:taskId")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./uploads",
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join("");

          const ext = extname(file.originalname);
          return cb(null, `${randomName}${ext}`); // Используем уникальное имя + расширение файла
        },
      }),
    })
  )
  async uploadFile(@UploadedFile() file, @Param("taskId") taskId: number) {
    console.log(file);
    const { originalname, path, mimetype } = file;
    const createdFile = await this.fileService.createFile({
      name: originalname,
      taskId,
      path,
      type: mimetype,
    });
    console.log(createdFile);
    return { message: "File uploaded successfully" };
  }

  @Get("/:taskId")
  async findAll(@Param("taskId") taskId: number): Promise<File[]> {
    console.log(taskId);
    console.log(await this.fileService.findAll(taskId));
    return await this.fileService.findAll(taskId);
  }
  @Get("/download/:fileId")
  async downloadFile(@Param("fileId") fileId: string, @Res() res: ExpressResponse) {
    const file = await this.fileService.getFileById(fileId);

    if (!file) {
      throw new NotFoundException("Файл не найден");
    }

    res.download(file.path, file.name);
  }
  @Get("/getFile/:fileId")
  async getFile(@Param("fileId") fileId: string, @Res() res: ExpressResponse) {
    const file = await this.fileService.getFileById(fileId);

    if (!file) {
      throw new NotFoundException("Файл не найден");
    }

    return file.path;
  }
  @Delete(":id")
  async remove(@Param("id") id: number): Promise<number> {
    return this.fileService.removeFile(id);
  }
}
