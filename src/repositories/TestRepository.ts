class TestRepository {

    async index(data: { message: string }) {

        data.message = "Hello World!";

        return data;
    }

}

export default TestRepository;