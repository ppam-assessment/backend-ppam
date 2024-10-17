import { accessStatus } from "@prisma/client";

const submitterAccessData = [
    {
      userId: '59828aa1-907b-4653-ad96-db735b0168cd',
      status: accessStatus.approved,
      reason: 'PKBI Daerah Aceh approved as submitter',
      date: new Date()
    },
    {
      userId: '0ae86cf0-ffd6-4c54-a71e-aa59d09f2db7',
      status: accessStatus.approved,
      reason: 'PKBI Daerah Sumbar approved as submitter',
      date: new Date()
    },
    {
      userId: '1f6976ee-214e-4e7f-a3c9-506845866980',
      status: accessStatus.approved,
      reason: 'PKBI Daerah Jateng approved as submitter',
      date: new Date()
    },
    {
      userId: '67557431-ca17-4662-aacc-6ac87af076fa',
      status: accessStatus.approved,
      reason: 'PKBI Daerah Jatim approved as submitter',
      date: new Date()
    }
  ];

  export default submitterAccessData;