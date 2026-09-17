import axios from "axios";

export const getProblem = async (id) => {
    const res = await axios.get(
        `http://localhost:5000/api/problems/${id}`
    );

    return res.data;
};