import { IMockadoService } from "./mocakoService.type";
import express from "express";
import type { Express } from "express";
import { mockadoEmoji } from "./constant";
import { getMappings } from "./helpers/folderCheck";

export class MockadoService {
    private app: Express;
    private mockList: Map<string, any>;

    constructor(private params: IMockadoService) {
        this.mockList = new Map();
        this.app = express();

        this.initializeServer();
    }

    private async initializeServer() {
        const { port = 3000 } = this.params;

        try {
            await this.loadMappings();
        } catch (error) {
            console.error(`${mockadoEmoji} Error loading mappings:`, error);
            return;
        }

        // Start the server
        this.app.listen(port, () => {
            console.log(`${mockadoEmoji} Mockado server running at http://localhost:${port}`);
        });

        // Setup default route
        this.app.get("/", (req, res) => {
            res.send(`${mockadoEmoji} Welcome to Mockado! Your mock server is up and running!`);
        });
    }

    private async loadMappings() {
        // Fetch the mappings and process them
        console.log(`${mockadoEmoji} Fetching mappings...`);
        try {
            await getMappings("mockado/mapping");
        } catch (error) {
            console.error(`${mockadoEmoji} Error in getMappings:`, error);
            throw error;
        }
    }
}
