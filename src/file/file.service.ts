import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { File } from "./file.model";
import { CreateFileDto } from "./dto/create-file.dto";
import fs from "fs";
import path from "path";
import { MulterModuleOptions } from "@nestjs/platform-express";
import { Express } from "express";
import { diskStorage } from "multer";
@Injectable()
export class FileService {
  constructor(
    @InjectModel(File)
    private fileRepository: typeof File
  ) {}

  async createFile(data: { name: string; taskId: number; path: string, type: string}) {
    const file = new File();
    console.log(data.path)
    file.name = data.name;
    file.taskId = data.taskId;
    file.path = data.path;
    file.type = data.type;
    await file.save();
    return file;
  }

  async findAll(taskId: number): Promise<File[]> {
    console.log(await this.fileRepository.findAll({ where: { taskId: taskId } }));
    return await this.fileRepository.findAll({ where: { taskId: taskId } });
  }

  async getFileById(fileId: string): Promise<File> {
    return this.fileRepository.findOne({ where: { id: fileId } });
  }



  async removeFile(id: number): Promise<number> {
    const deletedFileCount = await this.fileRepository.destroy({
      where: { id },
    });
    return deletedFileCount;
  }
}
