import { useState, useCallback } from 'react';

export interface AresResult {
  clientName: string;
  clientAddress: string;
  dic: string;
}

export function useAresLookup() {
  const [isFetchingIco, setIsFetchingIco] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchIcoDetails = useCallback(async (ico: string): Promise<AresResult | null> => {
    const cleanIco = ico.replace(/\D/g, '');
    if (cleanIco.length !== 8) return null;

    setIsFetchingIco(true);
    setError(null);

    try {
      const response = await fetch(
        `https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/${cleanIco}`
      );

      if (response.ok) {
        const data = await response.json();
        const clientName = data.obchodniJmeno || '';
        const dic = data.dic || `CZ${cleanIco}`;

        let bestAddress = data.sidlo?.textovaAdresa || '';
        if (data.dalsiUdaje && Array.isArray(data.dalsiUdaje)) {
          const resData = data.dalsiUdaje.find((d: any) => d.datovyZdroj === 'res');
          const rzpData = data.dalsiUdaje.find((d: any) => d.datovyZdroj === 'rzp');

          if (resData?.sidlo?.[0]?.sidlo?.textovaAdresa) {
            bestAddress = resData.sidlo[0].sidlo.textovaAdresa;
          } else if (rzpData?.sidlo?.[0]?.sidlo?.textovaAdresa) {
            bestAddress = rzpData.sidlo[0].sidlo.textovaAdresa;
          }
        }

        return {
          clientName,
          clientAddress: bestAddress,
          dic
        };
      } else {
        setError('IČO nenalezeno v ARES');
        return {
          clientName: 'IČO nenalezeno v ARES',
          clientAddress: 'Zkontrolujte správnost IČO',
          dic: ''
        };
      }
    } catch (err) {
      console.error('ARES fetch failed:', err);
      setError('Chyba připojení k ARES');
      return {
        clientName: 'Chyba připojení k ARES',
        clientAddress: 'Zkuste to prosím znovu',
        dic: ''
      };
    } finally {
      setIsFetchingIco(false);
    }
  }, []);

  return {
    isFetchingIco,
    error,
    fetchIcoDetails
  };
}
