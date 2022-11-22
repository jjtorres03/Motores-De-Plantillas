const fs = require("fs");

class Contenedor {
  constructor(fileName) {
    this.filename = fileName;
    this.readFileOrCreateNewOne();
  }

  async readFileOrCreateNewOne() {
    try {
      await fs.promises.readFile(this.filename, "utf-8");
    } catch (error) {
      error.code === "ENOENT"
        ? this.createEmptyFile()
        : console.log(
            `Codigo de Error: ${error.code} Se produjo un error inesperado al intentar leer ${this.filename}`
          );
    }
  }

  async createEmptyFile() {
    fs.writeFile(this.filename, "[]", (error) => {
      error
        ? console.log(error)
        : console.log(`File ${this.filename} fue creado porque no existía en el sistema`);
    });
  }

  async getById(id) {
    id = Number(id);
    try {
      const data = await this.getData();
      const parsedData = JSON.parse(data);

      return parsedData.find((producto) => producto.id === id);
    } catch (error) {
      console.log(
        `Codigo de Error: ${error.code} Se ha producido un error al intentar obtener un elemento por su ID (${id})`
      );
    }
  }

  async deleteById(id) {
    try {
      id = Number(id);
      const data = await this.getData();
      const parsedData = JSON.parse(data);
      const objectIdToBeRemoved = parsedData.find(
        (producto) => producto.id === id
      );

      if (objectIdToBeRemoved) {
        const index = parsedData.indexOf(objectIdToBeRemoved);
        parsedData.splice(index, 1);
        await fs.promises.writeFile(this.filename, JSON.stringify(parsedData));
        return true;
      } else {
        console.log(`ID ${id} no existe en el archivo`);
        return null;
      }
    } catch (error) {
      console.log(
        `Codigo de Error: ${error.code} Se ha producido un error al intentar eliminar un elemento por su ID (${id})`
      );
    }
  }

  async updateById(id, newData) {
    try {
      id = Number(id);
      const data = await this.getData();
      const parsedData = JSON.parse(data);
      const objectIdToBeUpdated = parsedData.find(
        (producto) => producto.id === id
      );
      if (objectIdToBeUpdated) {
        const index = parsedData.indexOf(objectIdToBeUpdated);
        const {title, price, thumbnail} = newData;

        parsedData[index]['title'] = title;
        parsedData[index]['price'] = price;
        parsedData[index]['thumbnail'] = thumbnail;
        await fs.promises.writeFile(this.filename, JSON.stringify(parsedData));
        return true;
      } else {
        console.log(`ID ${id} no existe en el archivo`);
        return null;
      }

    } catch (error) {
      `Codigo de Error : ${error.code} Se ha producido un error al intentar actualizar un elemento por su ID (${id})`
    }
  }

  async save(object) {
    try {
      const allData = await this.getData();
      const parsedData = JSON.parse(allData);

      object.id = parsedData.length + 1;
      parsedData.push(object);

      await fs.promises.writeFile(this.filename, JSON.stringify(parsedData));
      return object.id;
    } catch (error) {
      console.log(
        `Codigo de Error: ${error.code} Se ha producido un error al intentar guardar un elemento`
      );
    }
  }

  async deleteAll() {
    try {
      await this.createEmptyFile();
    } catch (error) {
      console.log(
        `Se ha producido un error (${error.code}) al intentar eliminar todos los objetos`
      );
    }
  }

  async getData() {
    const data = await fs.promises.readFile(this.filename, "utf-8");
    return data;
  }

  async getAll() {
    const data = await this.getData();
    return JSON.parse(data);
  }
}

module.exports = Contenedor;
