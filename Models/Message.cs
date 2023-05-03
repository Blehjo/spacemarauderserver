﻿using System.ComponentModel.DataAnnotations;

namespace planetnineserver.Models
{
	public class Message
	{
        public int MessageId { get; set; }

        public string? MessageValue { get; set; }

        [DataType(DataType.Date)]
        public DateTime DateCreated { get; set; } = DateTime.UtcNow;

        public int UserId { get; set; }
        public User? User { get; set; }

        public ICollection<MessageComment>? MessageComments { get; set; }
    }
}

