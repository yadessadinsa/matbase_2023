

    var  PipelineIII
    [
        // Stage 1
        {
            $unwind: {
                'path':  '$PrjNm',
                
            }
        },

        // Stage 2
        {
            $match: {
               
                
            }
        },

        // Stage 3
        {
            $group: {
                _id: "$filltype",
                Project:{$first: '$PrjNm'},
                Exec: { $sum : '$Quantity' },
                Plan: {$sum: '$TotExc'}, 
                UR: {$sum: '$shrnk'}
                
                
               
            }
        },

        // Stage 4
        {
            $project: { 'UR' : 1, 'Project': 1,'Exec': 1, 'Plan': 1, 'RemQuan': {$subtract: ['$Plan', '$Exec'] }, 'Progress': { $divide: [ "$Exec", "$Plan" ] } }
        },

        // Stage 5
        {
            $project: {'UR': 1, 'Project': 1,'Exec': 1, 'Plan': 1, 'RemQuan': 1, 'Progress': 1, 'ProgressM': { $multiply: [ "$Progress", 100 ] } }
        },

        // Stage 6
        {
            $project: {'UR': 1, 'Project': 1,'Exec': 1, 'Plan': 1, 'RemQuan': 1, 'Progress': 1, 'ProgressR': { $round: [ "$ProgressM", 2 ] }, 'Amount': { $multiply: [ "$Exec", '$UR' ] } }
        },

        // Stage 7
        {
            $project: {'UR': 1, 'Project': 1,'Exec': 1, 'Plan': 1, 'RemQuan': 1, 'Progress': 1, 'ProgressR': { $round: [ "$ProgressM", 2 ] }, 'Amount': 1 , 'PlanAm': { $multiply: [ "$Plan", '$UR' ] } }
        },

        // Stage 8
        {
            $project: {'UR': 1, 'Project': 1,'Exec': 1, 'Plan': 1, 'RemQuan': 1, 'Progress': 1, 'ProgressR': { $round: [ "$ProgressM", 2 ] }, 'Amount': 1 , 'PlanAm': 1, 'TotRatio': { $divide: [ "$Amount", '$PlanAm' ] } }
        },

        // Stage 9
        {
            $group: {
                _id: '$Project',
                AmountX: { $sum : '$Amount' },
                PlanAmX: {$sum: '$PlanAm'}, 
                
                
             
                
            }
        },

        // Stage 10
        {
            $project: { '_id': 1, 'AmountX': 1 , 'PlanAmX': 1, TotRatioX: { $divide: [ "$AmontX", '$PlanAmX' ] } }
        },

        // Stage 11
        {
            $project: { '_id': 1, 'AmountX': 1 , 'PlanAmX': 1, TotRatioX: 1, TotRatioXX: { $round: [ "$TotRatioX", 2 ] } }
        }
    ]

    