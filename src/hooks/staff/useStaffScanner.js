import { useState } from "react";
import { scanTicket } from "../../api/staff/StaffApi";

export const useStaffScanner = () => {
    const [loading, setLoading] = useState(false);
    const [scanResult, setScanResult] = useState(null);
    const [error, setError] = useState(null);

    const handleScan = async (serial) => {
        setLoading(true);
        setError(null);
        try {
            const result = await scanTicket(serial);
            setScanResult(result);
            return result;
        } catch (err) {
            const errMsg = err.response?.data?.message || "Gagal melakukan scan tiket.";
            setError(errMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const resetScan = () => {
        setScanResult(null);
        setError(null);
    };

    return { handleScan, loading, scanResult, error, resetScan };
};
