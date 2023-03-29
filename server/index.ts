// Import packages required by the app
import express, {Express, Request, Response} from "express"
import cors from "cors"
import {Pool, QueryResult} from "pg"

// Start new instance of express
const app: Express = express();
// Packges used by app
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}))

// Port number declaration
const port: number = 3001;

// Create connection with the database
const openDB = (): Pool => {
    const pool: Pool = new Pool ({
        user: "postgres",
        host: "localhost",
        database: "todo",
        password: "1234",
        port: 5432
        // user: "root",
        // host: "dpg-cggp5tu4daddcg550ivg-a.frankfurt-postgres.render.com",
        // database: "todo_aiux",
        // password: "Dp7lxWkQlr9Z1PXdojZIyuf8Q1Br3d57",
        // port: 5432,
        // ssl: true
    })
    return pool
}

app
    .get("/",(req: Request, res: Response) => {
        let pool = openDB()

        pool.query("select * from task", (error,result) => {
            if (error) {
                res.status(500).json({error: error.message})
            }
            res.status(200).json(result.rows)
        })
    })
    .post("/new", (req: Request, res: Response) => {
        let pool = openDB()

        pool.query("insert into task (description) values ($1) returning *",
        [req.body.description],
        (error: Error, result: QueryResult) => {
            if (error) {
                res.status(500).json({error: error.message})
            }
            res.status(200).json({id: result.rows[0].id})
        })
    })
    .delete("/delete/:id",async (req: Request, res: Response) => {
        let pool = openDB()

        let id = parseInt(req.params.id)

        pool.query("delete from task where id = $1",
        [id],
        (error: Error, result: QueryResult) => {
            if (error) {
                res.status(500).json({error: error.message})
            }
            res.status(200).json({id: id})
        })
    })
    .put("/update/:id", (req: Request, res: Response) => {
        let pool = openDB()

        let id = req.params.id
        let description = req.body.description

        pool.query("update task set description = $1 where id= $2 returning *",
        [description,id],
        (error: Error, result: QueryResult) => {
            if (error) {
                res.status(500).json({error: error.message})
            }

            res.status(200).json({id: result.rows[0].id})
        })
    })
    .put("/update-status/:id", (req: Request, res: Response) => {
        let pool = openDB()

        let id = req.params.id
        let completed = req.body.completed

        pool.query("update task set completed = $1 where id= $2 returning *",
        [completed,id],
        (error: Error, result: QueryResult) => {
            if (error) {
                res.status(500).json({error: error.message})
            }
            res.status(200).json({id: result.rows[0].id})
        })
    })

// Port listening
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});