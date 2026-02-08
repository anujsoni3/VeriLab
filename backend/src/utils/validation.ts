import { Response } from 'express';

/**
 * Validates if a string is a valid MongoDB ObjectId
 * @param id - The ID string to validate
 * @returns true if valid, false otherwise
 */
export const isValidObjectId = (id: string | undefined | null): boolean => {
    if (!id || id === 'undefined' || id === 'null') {
        return false;
    }
    // MongoDB ObjectId is a 24 character hex string
    return /^[0-9a-fA-F]{24}$/.test(id);
};

/**
 * Validates ObjectId and sends error response if invalid
 * @param id - The ID to validate
 * @param res - Express response object
 * @param resourceName - Name of the resource (e.g., 'Problem', 'User')
 * @returns true if valid, false if invalid (and response sent)
 */
export const validateObjectId = (
    id: string | undefined | null,
    res: Response,
    resourceName: string = 'Resource'
): boolean => {
    if (!id || id === 'undefined' || id === 'null') {
        res.status(400).json({
            success: false,
            error: `Invalid ${resourceName.toLowerCase()} ID`
        });
        return false;
    }

    if (!isValidObjectId(id)) {
        res.status(400).json({
            success: false,
            error: `Invalid ${resourceName.toLowerCase()} ID format`
        });
        return false;
    }

    return true;
};
