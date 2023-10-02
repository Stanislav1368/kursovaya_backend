import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Sequelize } from "sequelize-typescript";


async function start() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule)
    // Получите экземпляр сеанса Sequelize
    const sequelize = app.get(Sequelize);

    // Синхронизируйте модели с базой данных
    await sequelize.sync({ alter: true });
  app.enableCors();
  await app.listen(PORT, () => console.log(`Server started on port =${PORT}`))
}

start()