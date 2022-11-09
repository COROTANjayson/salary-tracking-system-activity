import { Leave } from "../src/modules/leaves"
import { Absence } from "../src/modules/absences"
import { Overtime } from "../src/modules/overtime"
export default [
    {
        employeeId: '1',
        salaryPerHR: 200,
        accountID: '1',
        companyID: '1',
        name: 'JJC',
        allowableLeaves: 6,
        allowableOvertime: 20,
        employeeType: 'full-time',
        leaves: [
            new Leave ('1',
                 '10/05/2022, 12:00:00 AM',
                '10/06/2022, 12:00:00 AM',
               'Seminar',
                 true
            ),
            new Leave  ('1',
                 '10/03/2022, 12:00:00 AM',
                '10/03/2022, 12:00:00 AM',
                 'Sick',
                true
            ),
            new Leave  ('1',
                '9/03/2022, 12:00:00 AM',
               '9/03/2022, 12:00:00 AM',
                'Sick',
               true
            )
            
        ],
        absences: [
            new Absence('1',
            '10/01/2022, 12:00:00 AM',
            '10/01/2022, 12:00:00 AM',)
        ],
        overtime: [
            new Overtime('1',
                '10/02/2022, 12:00:00 AM',
                '10/02/2022, 6:30:00 PM',
                '10/02/2022, 11:30:00 PM',
                 true,
                'fix bugs'
            ),
            new Overtime ('1',
                '10/07/2022, 12:00:00 AM',
                '10/07/2022, 6:30:00 PM',
                '10/07/2022, 10:30:00 PM',
                true,
                'finalise project'
            )
        ],
        

    },
    {
        employeeId: '1',
        salaryPerHR: 200,
        accountID: '1',
        companyID: '1',
        name: 'JJC',
        allowableLeaves: 4,
        allowableOvertime: 20,
        employeeType: 'part-time',
        leaves: [
            new Leave ('1',
                '10/04/2022, 12:00:00 AM',
                '10/06/2022, 12:00:00 AM',
               'Seminar',
                 true
            ),
            new Leave  ('1',
                 '10/02/2022, 12:00:00 AM',
                '10/03/2022, 12:00:00 AM',
                 'Sick',
                true
            )
        ],
        absences: [
            new Absence('1',
            '10/01/2022, 12:00:00 AM',
            '10/01/2022, 12:00:00 AM',)
        ],
        overtime: [
            new Overtime('1',
                '10/02/2022, 12:00:00 AM',
                '10/02/2022, 1:30:00 PM',
                '10/02/2022, 11:30:00 PM',
                 true,
                'fix bugs'
            ),
            new Overtime ('1',
                '10/07/2022, 12:00:00 AM',
                '10/07/2022, 12:00:00 PM',
                '10/07/2022, 11:00:00 PM',
                true,
                'finalise project'
            )
        ],
        

    }

]