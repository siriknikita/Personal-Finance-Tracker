const fetchAuthData = require('./utils')

describe('fetchAuthData function', () => {
    it('should fetch data successfully', async () => {
        // Mocking the fetch function
        global.fetch = jest.fn().mockResolvedValue({
            json: () => Promise.resolve({ /* mock response data */ }),
        });

        const email = 'test@example.com';
        const password = 'password1231-123-12-1-12';

        // Call the function
        const response = await fetchAuthData(email, password);
        const json = response['json'];
        console.log(json);
        const responseJSON = JSON.parse(json);
        // Assertions
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_API_URL}/api/test/userAuth/email/${email}/password/${password}`);
        expect(responseJSON).toEqual(true);
    });

    // it('should handle errors properly', async () => {
    //     // Mocking the fetch function to simulate an error
    //     global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

    //     const email = 'test@example.com';
    //     const password = 'password';

    //     // Call the function
    //     await expect(fetchAuthData(email, password)).rejects.toThrowError('Network error');

    //     // Assertions
    //     expect(fetch).toHaveBeenCalledTimes(1);
    //     expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_API_URL}/api/test/userAuth/email/${email}/password/${password}`);
    // });
});
