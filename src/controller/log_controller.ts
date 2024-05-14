import {Request, Response} from 'express';
import { getBloqueosService, verLogsService } from '../service/log_service';


async function verLogs(req: Request, res: Response) {
    try {
        const ipFiltro: string |undefined =  req.query.ip ? req.query.ip as string : undefined;

        const page = parseInt(req.body.page as string) || 1;
        const pageSize = parseInt(req.body.pageSize as string) || 10;

        const logs = await verLogsService(ipFiltro, page, pageSize);
        res.status(200).json(logs);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}
async function getBloqueos(req: Request, res: Response) {
    try {
        const ipFiltro: string |undefined =  req.query.ip ? req.query.ip as string : undefined;

        const page = parseInt(req.body.page as string) || 1;
        const pageSize = parseInt(req.body.pageSize as string) || 10;

        const bloqueos = await getBloqueosService(ipFiltro, page, pageSize);
        res.status(200).json(bloqueos);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

export {verLogs, getBloqueos}