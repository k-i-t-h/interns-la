USE [C84_InternsLA]
GO

/****** Object:  StoredProcedure [dbo].[Openings_Select_ById]    Script Date: 3/26/2020 12:04:00 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE PROC [dbo].[Openings_Select_ById] @Id INT OUTPUT
AS

/* 

Declare
	@Id int = 1


Execute dbo.Openings_Select_ById
	@Id OUTPUT

*/

    BEGIN
        SELECT [Id], 
               [OrganizationId], 
               [JobTypeId], 
               [LocationId], 
               [CreatedBy], 
               [Title], 
               [Description], 
               [Requirements], 
               [IsActive], 
               [ContactName], 
               [ContactPhone], 
               [ContactEmail], 
               [DateCreated], 
               [DateModified]
        FROM [dbo].[Openings]
        WHERE [Id] = @Id;
    END;
GO

